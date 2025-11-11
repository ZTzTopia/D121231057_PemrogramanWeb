function validateBook(req, res, next) {
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is required' });
  }

  if (!req.body.title || !req.body.author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  const title = req.body.title && req.body.title.trim();
  const author = req.body.author && req.body.author.trim();

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  next();
}

module.exports = validateBook;
