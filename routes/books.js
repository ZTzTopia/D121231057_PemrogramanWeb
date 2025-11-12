const express = require('express');
const router = express.Router();
const validateBook = require('../middlewares/validateBook');

let books = [];
let idCounter = 1;

router.get('/', (req, res) => {
  res.json(books);
});

router.get('/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.json(book);
});

router.post('/', validateBook, (req, res) => {
  const title = req.body.title.trim();
  const author = req.body.author.trim();

  const isDuplicate = books.some(b => b.title === title && b.author === author);
  if (isDuplicate) {
    return res.status(409).json({ message: 'Book already exists' });
  }

  const newBook = { 
    id: idCounter++, 
    title: title,
    author: author,
    cover: '/images/600x400.png'
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

router.put('/:id', validateBook, (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const title = req.body.title.trim();
  const author = req.body.author.trim();

  const isDuplicate = books.some((b, index) => b.title === title && b.author === author && index !== bookIndex);
  if (isDuplicate) {
    return res.status(409).json({ message: 'Another book with the same title and author already exists' });
  }

  books[bookIndex] = { 
    id: bookId,
    title: title,
    author: author,
    cover: '/images/600x400.png'
  };
  res.json(books[bookIndex]);
});

router.delete('/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books.splice(bookIndex, 1);
  res.status(204).end();
});

module.exports = router;
