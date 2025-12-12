const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcrypt');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Starting Seeder...');

    console.log('Cleaning database...');
    await prisma.subscription.deleteMany();
    await prisma.subscriptionPlan.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    console.log('Creating Admin...');
    const adminPassword = await bcrypt.hash('AdminPass123!', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            password: adminPassword,
            name: 'Super Admin',
            role: 'ADMIN',
        },
    });

    console.log('Creating Products...');
    const productData = [
        'Project Management Tool',
        'CRM System',
        'Email Marketing Platform',
        'HR Management',
        'Analytics Dashboard'
    ];

    const products = [];
    for (const name of productData) {
        const product = await prisma.product.create({
            data: { name },
        });
        products.push(product);
    }

    console.log('Creating Subscription Plans...');
    const planTypes = [
        { name: 'Basic', priceModifier: 10 },
        { name: 'Pro', priceModifier: 29 },
        { name: 'Enterprise', priceModifier: 99 }
    ];

    const plans = [];
    for (const product of products) {
        for (const type of planTypes) {
            const plan = await prisma.subscriptionPlan.create({
                data: {
                    name: `${product.name} - ${type.name}`,
                    price: type.priceModifier,
                    productId: product.id,
                },
            });
            plans.push(plan);
        }
    }

    console.log('Creating Regular Users...');
    const userPassword = await bcrypt.hash('UserPass123!', 10);
    const users = [];
    for (let i = 1; i <= 5; i++) {
        const user = await prisma.user.create({
            data: {
                email: `user${i}@example.com`,
                password: userPassword,
                name: `Regular User ${i}`,
                role: 'USER',
            },
        });
        users.push(user);
    }

    console.log('Assigning Subscriptions...');
    for (const user of users) {
        const randomPlan = plans[Math.floor(Math.random() * plans.length)];

        await prisma.subscription.create({
            data: {
                userId: user.id,
                planId: randomPlan.id,
            },
        });
    }

    console.log('Seeding completed successfully.');
}

main()
    .catch((e) => {
        console.error('Seeder failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
