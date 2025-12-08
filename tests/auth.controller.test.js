const { describe, it, expect, mock, beforeEach } = require('bun:test');

// Mock dependencies BEFORE requiring controller
const mockPrisma = {
    user: {
        findUnique: mock(),
        create: mock(),
    },
};

const mockAuthUtils = {
    hashPassword: mock(),
    comparePassword: mock(),
    generateAccessToken: mock(),
    generateRefreshToken: mock(),
    verifyToken: mock(),
};

// Mock modules
mock.module('../src/config/database', () => ({
    default: mockPrisma,
    __esModule: true,
    ...mockPrisma
}));

mock.module('../src/utils/auth.utils', () => mockAuthUtils);
mock.module('../src/config/database', () => mockPrisma);


const authController = require('../src/controllers/auth.controller');

describe('Auth Controller', () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: mock().mockReturnThis(),
            json: mock(),
        };
        mockPrisma.user.findUnique.mockReset();
        mockPrisma.user.create.mockReset();
        mockAuthUtils.hashPassword.mockReset();
        mockAuthUtils.comparePassword.mockReset();
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };

            // Removed findUnique mock since it's no longer called
            mockAuthUtils.hashPassword.mockResolvedValue('hashedPassword');
            mockPrisma.user.create.mockResolvedValue({
                id: 1,
                email: 'test@example.com',
                password: 'hashedPassword',
                name: 'Test User',
                role: 'USER',
            });

            await authController.register(req, res);

            // Expect findUnique NOT to be called
            expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
            expect(mockAuthUtils.hashPassword).toHaveBeenCalledWith('password123');
            expect(mockPrisma.user.create).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'User registered successfully',
                user: expect.objectContaining({ email: 'test@example.com' }),
            }));
        });

        it('should return 400 if user already exists (P2002 error)', async () => {
            req.body = {
                email: 'existing@example.com',
                password: 'password123',
                name: 'Existing User',
            };

            // Simulate Prisma unique constraint error
            const prismaError = new Error('Unique constraint failed');
            prismaError.code = 'P2002';
            prismaError.meta = { target: ['email'] };

            mockAuthUtils.hashPassword.mockResolvedValue('hashedPassword');
            mockPrisma.user.create.mockRejectedValue(prismaError);

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
        });
    });

    describe('login', () => {
        it('should login successfully with valid credentials', async () => {
            req.body = { email: 'test@example.com', password: 'password123' };
            const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', role: 'USER' };

            mockPrisma.user.findUnique.mockResolvedValue(user);
            mockAuthUtils.comparePassword.mockResolvedValue(true);
            mockAuthUtils.generateAccessToken.mockReturnValue('access_token');
            mockAuthUtils.generateRefreshToken.mockReturnValue('refresh_token');

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Login successful',
                accessToken: 'access_token',
                refreshToken: 'refresh_token'
            });
        });

        it('should return 401 with invalid credentials', async () => {
            req.body = { email: 'test@example.com', password: 'wrongpassword' };
            const user = { id: 1, email: 'test@example.com', password: 'hashedPassword', role: 'USER' };

            mockPrisma.user.findUnique.mockResolvedValue(user);
            mockAuthUtils.comparePassword.mockResolvedValue(false);

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });
    });
});
