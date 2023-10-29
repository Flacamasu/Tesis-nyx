const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const app = express();
const SECRET_KEY = 'secret123';
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCtD52oDPKnKhLFx-SZApvdIgDIerAiwYE',
  Promise: Promise
});
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
app.get('/api/estudiantes', (req, res) => {
  db.query('SELECT * FROM estudiantes', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get('/api/ofertas', (req, res) => {
  db.query('SELECT * FROM ofertas', (err, result) => {
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

app.post('/api/autenticarEmpresa', (req, res) => {
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
      res.json({ autenticado: true, token, usuario: userData, tUsuario: "empresa" });
    } else {
      // Autenticación fallida
  
      res.json({ autenticado: false });
    }
  });
});

app.post('/api/autenticarEstudiante', (req, res) => {
  const { usuario, contraseña } = req.body;

  // Consulta SQL para buscar el usuario en la base de datos
  const sql = 'SELECT * FROM estudiantes WHERE usuario = ? AND contraseña = ?';
  
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
      res.json({ autenticado: true, token, usuario: userData, tUsuario: "estudiante"});
    } else {
      // Autenticación fallida
  
      res.json({ autenticado: false });
    }
  });
});

app.post('/api/empresaRegistro', (req, res) => {
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
app.post('/api/estudianteRegistro', (req, res) => {
  try {
    const { usuario, nombre, telefono, carrera, descripcion, direccion, correo, contraseña, especialidad, genero, edad, intereses, proyectos, habilidades, conocimientos, estudios } = req.body;
    
    // Consulta SQL para insertar el nuevo usuario en la base de datos
    const sql = 'INSERT INTO estudiantes (usuario, nombre, telefono, carrera, descripcion, direccion, correo, contraseña, especialidad, genero, edad, intereses, proyectos, habilidades, conocimientos, estudios) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)';
    
    db.query(sql, [usuario, nombre, telefono, carrera, descripcion, direccion, correo, contraseña, especialidad, genero, edad, intereses, proyectos, habilidades, conocimientos, estudios], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al registrar el usuario');
        return;
      }
      // Usuario registrado exitosamente
      res.status(201).json({ usuario: { id: result.insertId, usuario, nombre, telefono, carrera, descripcion, direccion, correo, contraseña, especialidad, genero, edad, intereses, proyectos, habilidades, conocimientos, estudios } });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/api/ofertas/agregar', (req, res) => {
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

app.post('/api/estudiantes/modificar', async (req, res) => {
  try {
    const { id, usuario, contraseña, correo, telefono, nombre, carrera, especialidad, descripcion, genero, edad, intereses, proyectos, habilidades, conocimientos, estudios, calle_numero, region, comuna } = req.body;
    
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

app.post('/api/ofertas/modificar', async (req, res) => {
  try {
    const { id, titulo, departamentoBack, tags, descripcion, remuneracion, modalidad} = req.body;
    
    if (!id) {
      res.status(400).send('El ID del usuario es obligatorio');
      return;
    }

    // Construir dinámicamente la consulta SQL y los valores
    let sql = 'UPDATE ofertas SET ';
    const values = [];

    if (titulo) {
      sql += 'titulo = ?, ';
      values.push(titulo);
    }
    if (departamentoBack) {
      sql += 'departamento = ?, ';
      values.push(departamentoBack);
    }
    if (tags) {
      sql += 'tags = ?, ';
      values.push(tags);
    }
    if (descripcion) {
      sql += 'descripcion = ?, ';
      values.push(descripcion);
    }
    if (remuneracion) {
      sql += 'remuneracion = ?, ';
      values.push(remuneracion);
    }
    if (modalidad) {
      sql += 'modalidad = ?, ';
      values.push(modalidad);
    }
    
    // Eliminar la última coma y espacio
    sql = sql.slice(0, -2);
    
    // Añadir la condición WHERE al final de la consulta SQL
    sql += ' WHERE id_oferta = ?';
    values.push(id);

    if (values.length === 1) {
      res.status(400).send('No hay campos para actualizar');
      return;
    }
    // Ejecutar la consulta de actualización
    const updateResult = await db.promise().query(sql, values);
    
    // Verificar si la actualización fue exitosa
    if (updateResult[0].affectedRows === 0) {
      res.status(404).send('Usuario no encontrado');
      return;
    }

    // Obtener el usuario actualizado
    const sql2 = 'SELECT * FROM ofertas WHERE id_oferta = ?';
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
// Check if the student has already applied for the offer
app.get('/api/postulacion/check/:id_oferta/:id_estudiante', (req, res) => {
  const { id_estudiante, id_oferta } = req.params;
  const sql = 'SELECT * FROM postulaciones WHERE id_estudiante = ? AND id_oferta = ?';
  db.query(sql, [id_estudiante, id_oferta], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json({ alreadyApplied: result.length > 0 });
  });
});

// Delete a student's application to an offer
app.delete('/api/postulacion/delete/:id_oferta/:id_estudiante', (req, res) => {
  const { id_estudiante, id_oferta } = req.params;
  const sql = 'DELETE FROM postulaciones WHERE id_estudiante = ? AND id_oferta = ?';
  db.query(sql, [id_estudiante, id_oferta], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.status(200).send('Postulación eliminada');
  });
});

app.post('/api/postulacion/agregar', (req, res) => {
  const { id_estudiante, id_oferta } = req.body;
  const sql = 'INSERT INTO postulaciones (id_estudiante, id_oferta) VALUES (?, ?)';
  db.query(sql, [id_estudiante, id_oferta], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al registrar el usuario');
      return;
    }
    res.status(201).json({ postulaciones: { id: result.insertId, id_estudiante, id_oferta } });
  });
});


async function calcularDistancia(origen, destino) {
  try {
    const response = await googleMapsClient.distanceMatrix({
      origins: [origen],
      destinations: [destino],
      mode: 'driving'
    }).asPromise();

    const distanciaTexto = response.json.rows[0].elements[0].distance.text;
    const distanciaNumerica = parseFloat(distanciaTexto);
    return distanciaNumerica;  
  } catch (error) {
    console.error('Error al calcular la distancia:', error);
    throw error;
  }
}

app.post('/api/busqueda', (req, res) => {
  try {
    const { termino, puntuacion, remuneracion, horario, modalidad, direccionUsuario} = req.body;
    
    if (!termino) {
      res.status(400).send('El término de búsqueda es obligatorio');
      return;
    }

    let sql = 'SELECT ofertas.*, empresas.puntuacion_total ' +
  'FROM ofertas ' +
  'JOIN empresas ON ofertas.id_empresa = empresas.id_empresa ' +
  'WHERE (ofertas.titulo LIKE ? OR ofertas.descripcion LIKE ?) ';

    const params = [`%${termino}%`, `%${termino}%`];

    if (puntuacion) {
      sql += 'AND empresas.puntuacion_total >= ? ';
      params.push(puntuacion);
    }
    if (remuneracion) {
      sql += 'AND ofertas.remuneracion >= ? ';
      params.push(remuneracion);
    }
    if (horario) {
      sql += 'AND ofertas.horario = ? ';
      params.push(horario);
    }
    if (modalidad) {
      sql += 'AND ofertas.modalidad = ? ';
      params.push(modalidad);
    }

    db.query(sql, params, async (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al realizar la búsqueda');
        return;
      }

      const ofertasConPuntuacion = [];
      for (const oferta of results) {
        let puntuacionCalculada = 0;

        // Calcula la puntuación en base a la modalidad
        if (oferta.modalidad === 'Presencial' && direccionUsuario) {
          const distancia = await calcularDistancia(direccionUsuario, oferta.calle_numero);
          puntuacionCalculada += 50 - distancia;
        } else if (oferta.modalidad === 'Remoto') {
          puntuacionCalculada += 50;
        }

        // Agrega la puntuación de la empresa
        switch (oferta.puntuacion_total) {
          case 5:
            puntuacionCalculada += 50;
            break;
          case 4:
            puntuacionCalculada += 40;
            break;
          case 3:
            puntuacionCalculada += 30;
            break;
          case 2:
            puntuacionCalculada += 20;
            break;
          case 1:
            puntuacionCalculada += 10;
            break;
          default:
            puntuacionCalculada += 0;
            break;
        }

        // Calcula la puntuación en base a la fecha
        const fechaOferta = new Date(oferta.fecha);
        const fechaActual = new Date();
        const diferenciaDias = Math.floor((fechaActual - fechaOferta) / (1000 * 60 * 60 * 24));
        
        if (diferenciaDias === 0) {
          puntuacionCalculada += 50;
        } else if (diferenciaDias === 1) {
          puntuacionCalculada += 50;
        } else if (diferenciaDias <= 7) {
          puntuacionCalculada += 40;
        } else if (diferenciaDias <= 14) {
          puntuacionCalculada += 30;
        } else if (diferenciaDias <= 21) {
          puntuacionCalculada += 20;
        } else if (diferenciaDias <= 30) {
          puntuacionCalculada += 10;
        }
        console.log(puntuacionCalculada);
        ofertasConPuntuacion.push({ ...oferta, puntuacionCalculada });
      }

      // Ordena las ofertas en base a la puntuación calculada
      ofertasConPuntuacion.sort((a, b) => b.puntuacionCalculada - a.puntuacionCalculada);
      res.send(ofertasConPuntuacion);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
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
app.post('/api/postulacion/estudiante', (req, res) => {
  try {
    const { id_estudiante } = req.body; // obtener el término de búsqueda del cuerpo de la solicitud
    
    if (!id_estudiante) {
      res.status(400).send('El id del estudiante es obligatorio');
      return;
    }


    const sql = 'SELECT * FROM postulaciones WHERE id_estudiante = ?';
    
    db.query(sql, [id_estudiante], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al realizar la búsqueda');
        return;
      }
      // Devolver las ofertas que coinciden con el término de búsqueda
      res.send(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor')
  }
});