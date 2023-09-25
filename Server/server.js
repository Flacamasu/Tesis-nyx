const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const app = express();
const SECRET_KEY = 'secret123';

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
      const userData = result[0];
      delete userData.contraseña;
      const token = jwt.sign(userData, SECRET_KEY, {
        expiresIn: '1h'  // El token expira en 1 hora
      });
      res.json({ autenticado: true, token, usuario: userData });
    } else {
      // Autenticación fallida
  
      res.json({ autenticado: false });
    }
  });
});
app.post('/api/usuarios', (req, res) => {
  try {
    const { nombre, usuario, contraseña, logo, descripcion, direccion, correo, numero } = req.body;
    
    // Consulta SQL para insertar el nuevo usuario en la base de datos
    const sql = 'INSERT INTO empresas (nombre, usuario, contraseña, logo, descripcion, direccion, correo, numero) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [nombre, usuario, contraseña, logo, descripcion, direccion, correo, numero], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al registrar el usuario');
        return;
      }
      // Usuario registrado exitosamente
      res.status(201).json({ usuario: { id: result.insertId, nombre, usuario, logo, descripcion, direccion, correo, numero } });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});
app.post('/api/ofertas', (req, res) => {
  try {
    const { id_empresa, titulo, empresa, puntuacion, departamento, tags, descripcion, remuneracion, fecha } = req.body;
    
    // Consulta SQL para insertar el nueva oferta en la base de datos
    const sql = 'INSERT INTO postulaciones (id_empresa, titulo, empresa, puntuacion, departamento, tags, descripcion, remuneracion, fecha) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(sql, [id_empresa, titulo, empresa, puntuacion, departamento, tags, descripcion, remuneracion, fecha], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al registrar el usuario');
        return;
      }
      // Usuario registrado exitosamente
      res.status(201).json({ postulaciones: { id: result.insertId, id_empresa, titulo, empresa, puntuacion, departamento, tags, descripcion, remuneracion, fecha} });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});
app.post('/api/usuarios/modificar', async (req, res) => {
  try {
    const { id, nombre, usuario, contraseña, descripcion, direccion, correo, numero } = req.body;
    
    if (!id) {
      res.status(400).send('El ID del usuario es obligatorio');
      return;
    }

    // Construir dinámicamente la consulta SQL y los valores
    let sql = 'UPDATE empresas SET ';
    const values = [];

    if (nombre) {
      sql += 'nombre = ?, ';
      values.push(nombre);
    }
    if (usuario) {
      sql += 'usuario = ?, ';
      values.push(usuario);
    }
    if (contraseña) {
      sql += 'contraseña = ?, ';
      values.push(contraseña);
    }
    if (descripcion) {
      sql += 'descripcion = ?, ';
      values.push(descripcion);
    }
    if (direccion) {
      sql += 'direccion = ?, ';
      values.push(direccion);
    }
    if (correo) {
      sql += 'correo = ?, ';
      values.push(correo);
    }
    if (numero) {
      sql += 'numero = ?, ';
      values.push(numero);
    }
    
    // Eliminar la última coma y espacio
    sql = sql.slice(0, -2);
    
    // Añadir la condición WHERE al final de la consulta SQL
    sql += ' WHERE id_empresa = ?';
    values.push(id);
    
    // Ejecutar la consulta de actualización
    const updateResult = await db.promise().query(sql, values);
    
    // Verificar si la actualización fue exitosa
    if (updateResult[0].affectedRows === 0) {
      res.status(404).send('Usuario no encontrado');
      return;
    }

    // Obtener el usuario actualizado
    const sql2 = 'SELECT * FROM empresas WHERE id_empresa = ?';
    const [rows] = await db.promise().query(sql2, [id]);
    
    if (rows.length > 0) {
      const usuarioActualizado = rows[0];
      delete usuarioActualizado.contraseña;
      
      res.status(200).json({
        message: 'Usuario modificado',
        usuario: usuarioActualizado
      });
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});