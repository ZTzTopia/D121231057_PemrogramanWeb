function parsePagination(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy || 'createdAt';
    const order = query.order === 'desc' ? 'desc' : 'asc';

    const { search, ...rest } = query;
    const filters = { ...rest };
    ['page', 'limit', 'sortBy', 'order'].forEach(field => delete filters[field]);

    return { page, limit, skip, sortBy, order, filters, search };
}

function formatPagination(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return { totalDetails: total, totalPages, currentPage: page, limit };
}

module.exports = { parsePagination, formatPagination };
