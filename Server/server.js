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

app.get('/api/empresas', (req, res) => {
  db.query('SELECT * FROM empresas', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get('/api/postulaciones', (req, res) => {
  db.query('SELECT * FROM postulaciones', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get('/api/departamentos', (req, res) => {
  db.query('SELECT * FROM departamentos', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post('/api/autenticar', (req, res) => {
  const { usuario, contraseña } = req.body;

  // Consulta SQL para buscar el usuario en la base de datos
  const sql = 'SELECT * FROM empresas WHERE usuario = ? AND contraseña = ?';
  
  db.query(sql, [usuario, contraseña], (err, result) => {
    console.log(usuario);
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }

    if (result.length > 0) {
      // Autenticación exitosa
      res.json({ autenticado: true });
    } else {
      // Autenticación fallida
  
      res.json({ autenticado: false });
    }
  });
});