exports.parsePagination = (query = {}) => {
    const maxLimit = 100;

    const rawPage = parseInt(query.page, 10);
    const rawLimit = parseInt(query.limit, 10);

    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, maxLimit) : 10;
    const skip = (page - 1) * limit;

    const sortBy = typeof query.sortBy === 'string' && query.sortBy.length ? query.sortBy : 'createdAt';
    const order = query.order === 'desc' ? 'desc' : 'asc';

    const { search, ...rest } = query;
    const filters = { ...rest };
    ['page', 'limit', 'sortBy', 'order'].forEach(field => delete filters[field]);

    return { page, limit, skip, sortBy, order, filters, search };
};

exports.formatPagination = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    return { totalDetails: total, totalPages, currentPage: page, limit };
};
