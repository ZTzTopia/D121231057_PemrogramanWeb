const path = require('path');
const express = require('express');
const logger = require('./middlewares/logger');
const booksRouter = require('./routes/books');

const app = express();
const port = 3000;

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/images', express.static(path.join(__dirname, 'static/images')));
app.use('/api/books', booksRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
