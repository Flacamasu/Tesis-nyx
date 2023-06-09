const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.listen(5000, () => {
  console.log('Servidor en el puerto 5000');
});

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nyx',
});

app.get('/api/data', (req, res) => {
  db.query('SELECT * FROM empresas', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});