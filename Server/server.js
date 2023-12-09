const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); 


const googleMapsClient = require('@google/maps').createClient({
  key: '',
  Promise: Promise
});
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.listen(5000, () => {
  console.log('Servidor en el puerto 5000');
});

const transporter = nodemailer.createTransport({
  service: 'gmail', // Ejemplo usando Gmail
  auth: {
    user: 'nyx.practicas@gmail.com',
    pass: ''
  }
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

app.get('/api/feedbacks', (req, res) => {
  db.query('SELECT * FROM feedbacks', (err, result) => {
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
      
      res.json({ autenticado: true, usuario: userData, tUsuario: "empresa" });
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
  console.log(req.body)
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
      
      res.json({ autenticado: true, usuario: userData, tUsuario: "estudiante"});
    } else {
      // Autenticación fallida
  
      res.json({ autenticado: false });
    }
  });
});



app.post('/api/empresaRegistro', upload.single('logo'), (req, res) => {
  try {
    const { nombre, usuario, contrasena, descripcion, correo, numero, calle_numero, region, comuna } = req.body;
    console.log(req.body);
    const logoBuffer = req.file.buffer;
    // Consulta SQL para insertar el nuevo usuario en la base de datos
    const sql = 'INSERT INTO empresas (nombre, usuario, contraseña, logo, descripcion, correo, numero, calle_numero, region, comuna) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nombre, usuario, contrasena, logoBuffer, descripcion, correo, numero, calle_numero, region, comuna], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al registrar el usuario');
        return;
      }
      // Prepara el mensaje de correo electrónico
      const mailOptions = {
        from: 'nyx.practicas@gmail.com',
        to: correo, // Correo del usuariNombre de o registrado
        subject: 'Registro Exitoso en Nyx',
        text: `Hola ${nombre},\n\nTu registro en Nyx como empresa ha sido exitoso.\n\nSaludos,\nEquipo de Nyx`
        // Puedes usar 'html' en lugar de 'text' si quieres enviar un correo electrónico HTML
      };
      // Envía el correo electrónico
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo electrónico:', error);
        } else {
          console.log('Correo enviado: ' + info.response);
        }
      });
      res.status(201).json({ usuario: { id: result.insertId, nombre, usuario, contrasena, logo: logoBuffer, descripcion, correo, numero } });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});
app.post('/api/estudianteRegistro', upload.single('imagen'), (req, res) => {
  try {
    const { usuario, nombre, telefono, carrera, descripcion, correo, contrasena, especialidad, genero, edad, intereses, proyectos, habilidades, conocimientos, estudios, calle_numero, region, comuna } = req.body;
    const imagenBuffer = req.file.buffer;
    console.log(req.body);
    // Consulta SQL para insertar el nuevo usuario en la base de datos
    const sql = 'INSERT INTO estudiantes (usuario, nombre, telefono, imagen, carrera, descripcion, correo, contraseña, especialidad, genero, edad, intereses, proyectos, habilidades, conocimientos, estudios, calle_numero, region, comuna) VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?)';
  
    db.query(sql, [usuario, nombre, telefono, imagenBuffer, carrera, descripcion, correo, contrasena, especialidad, genero, edad, intereses, proyectos, habilidades, conocimientos, estudios, calle_numero, region, comuna], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al registrar el usuario');
        return;
      }
      // Usuario registrado exitosamente
      const mailOptions = {
        from: 'nyx.practicas@gmail.com',
        to: correo, // Correo del usuario registrado
        subject: 'Registro Exitoso en Nyx',
        text: `Hola ${nombre},\n\nTu registro en Nyx como empresa ha sido exitoso.\n\nSaludos,\nEquipo de Nyx`
        // Puedes usar 'html' en lugar de 'text' si quieres enviar un correo electrónico HTML
      };
      // Envía el correo electrónico
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar el correo electrónico:', error);
        } else {
          console.log('Correo enviado: ' + info.response);
        }
      });
      res.status(201).json({ usuario: { id: result.insertId, usuario, nombre, telefono, carrera, descripcion, correo, contrasena, especialidad, genero, edad, intereses, proyectos, habilidades, conocimientos, estudios } });
  
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/api/ofertas/agregar', (req, res) => {
  try {
    const { id_empresa, titulo, empresa, puntuacion, departamento, tags, descripcion, remuneracion, fecha, horario, modalidad, calleNumero, comuna, region } = req.body;
    const estado = 'Oferta';
    // Consulta SQL para insertar el nueva oferta en la base de datos
    const sql = 'INSERT INTO ofertas (id_empresa, titulo, departamento, tags, descripcion, remuneracion, fecha, horario, modalidad, calle_numero, comuna, region, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,?, ?, ?)';
    
    db.query(sql, [id_empresa, titulo, departamento, tags, descripcion, remuneracion, fecha, horario, modalidad, calleNumero, comuna, region, estado], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al registrar el usuario');
        return;
      }
      // Usuario registrado exitosamente
      res.status(201).json({ postulaciones: { id: result.insertId, id_empresa, titulo, empresa, puntuacion, departamento, tags, descripcion, remuneracion, fecha, horario, modalidad, calleNumero, comuna, region, estado} });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/api/departamentos/agregar', (req, res) => {
  try {
    const { id_empresa, nombre } = req.body;
    
    // Consulta SQL para insertar el nueva oferta en la base de datos
    const sql = 'INSERT INTO departamentos (id_empresa, nombre) VALUES (?, ?)';
    
    db.query(sql, [id_empresa, nombre], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al registrar el usuario');
        return;
      }
      // Usuario registrado exitosamente
      res.status(201).json({ departamento: {id_departamentos: result.insertId, id_empresa, nombre}});
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});


app.post('/api/usuarios/modificar', async (req, res) => {
  try {
    const { id, nombre, usuario, contraseña, descripcion, calleNumero,comuna,region, correo, numero } = req.body;
    
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
    if (calleNumero) {
      sql += 'calle_numero = ?, ';
      values.push(calleNumero);
    }
    if (comuna) {
      sql += 'comuna = ?, ';
      values.push(comuna);
    }
    if (region) {
      sql += 'region = ?, ';
      values.push(region);
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
    const { id, usuario, contraseña, correo, telefono, nombre, carrera, especialidad, descripcion, genero, edad, intereses, proyectos, habilidades, conocimientos, estudios, calleNumero, region, comuna } = req.body;
    
    if (!id) {
      res.status(400).send('El ID del usuario es obligatorio');
      return;
    }

    // Construir dinámicamente la consulta SQL y los valores
    let sql = 'UPDATE estudiantes SET ';
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
    if (calleNumero) {
      sql += 'calle_numero = ?, ';
      values.push(calleNumero);
    }
    if (region) {
      sql += 'region = ?, ';
      values.push(region);
    }
    if (comuna) {
      sql += 'comuna = ?, ';
      values.push(comuna);
    }
    if (correo) {
      sql += 'correo = ?, ';
      values.push(correo);
    }
    if (telefono) {
      sql += 'telefono = ?, ';
      values.push(telefono);
    }
    if (carrera) {
      sql += 'carrera = ?, ';
      values.push(carrera);
    }
    if (especialidad) {
      sql += 'especialidad = ?, ';
      values.push(especialidad);
    }
    if (genero) {
      sql += 'genero = ?, ';
      values.push(genero);
    }
    if (edad) {
      sql += 'edad = ?, ';
      values.push(edad);
    }
    if (intereses) {
      sql += 'intereses = ?, ';
      values.push(intereses);
    }
    if (proyectos) {
      sql += 'proyectos = ?, ';
      values.push(proyectos);
    }
    if (habilidades) {
      sql += 'habilidades = ?, ';
      values.push(habilidades);
    }
    if (conocimientos) {
      sql += 'conocimientos = ?, ';
      values.push(conocimientos);
    }
    if (estudios) {
      sql += 'estudios = ?, ';
      values.push(estudios);
    }
    // Eliminar la última coma y espacio
    sql = sql.slice(0, -2);
    
    // Añadir la condición WHERE al final de la consulta SQL
    sql += ' WHERE id_estudiante = ?';
    values.push(id);
    
    // Ejecutar la consulta de actualización
    const updateResult = await db.promise().query(sql, values);
    
    // Verificar si la actualización fue exitosa
    if (updateResult[0].affectedRows === 0) {
      res.status(404).send('Usuario no encontrado');
      return;
    }

    // Obtener el usuario actualizado
    const sql2 = 'SELECT * FROM estudiantes WHERE id_estudiante = ?';
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
    const { id, titulo, departamentoBack, tags, descripcion, remuneracion, horario, modalidad} = req.body;
    
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
    if (horario) {
      sql += 'horario = ?, ';
      values.push(horario);
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
  const { id_estudiante, id_oferta, fecha } = req.body;
  const estado = 'Pendiente';
  const sql = 'INSERT INTO postulaciones (id_estudiante, id_oferta, fecha, estado) VALUES (?, ?, ?, ?)';
  db.query(sql, [id_estudiante, id_oferta, fecha, estado], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al registrar el usuario');
      return;
    }
    res.status(201).json({ postulaciones: { id: result.insertId, id_estudiante, id_oferta, fecha, estado } });
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
    console.error('Error al calcular la distancia');
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
        if (oferta.modalidad === 'Presencial') {
          try{
            const distancia = await calcularDistancia(direccionUsuario, oferta.calle_numero);
            puntuacionCalculada += 50 - distancia; 
            console.log("si hay distancia");
          } catch (error){
            console.log("ajaa")
            puntuacionCalculada += 50;
          }
          

        } else if (oferta.modalidad === 'Remoto') {
          puntuacionCalculada += 50;
          console.log("no hay distancia");
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
app.patch('/api/postulaciones/:id', (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;
 ;
  // Aquí iría la lógica para validar el nuevo estado y el id de la postulación...

  // Y aquí la lógica para actualizar la postulación en la base de datos...
  const sql = 'UPDATE postulaciones SET estado = ? WHERE id_postulacion = ?';
  db.query(sql, [nuevoEstado, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al actualizar la postulación');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('Postulación no encontrada');
      return;
    }

    res.send({ mensaje: 'Postulación actualizada correctamente' });
  });
});

app.patch('/api/ofertas/:id', (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;

  const sqlEstadoActual = 'SELECT estado FROM ofertas WHERE id_oferta = ?';
  db.query(sqlEstadoActual, [id], (err, ofertas) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener el estado de la oferta' });
      return;
    }

    if (ofertas.length === 0) {
      res.status(404).json({ error: 'Oferta no encontrada' });
      return;
    }

    const estadoActual = ofertas[0].estado;

    // Si el estado actual es "En proceso", actualiza directamente sin verificar postulaciones
    if (estadoActual === 'En proceso') {
      const sqlActualizar = 'UPDATE ofertas SET estado = ? WHERE id_oferta = ?';
      db.query(sqlActualizar, [nuevoEstado, id], (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error al actualizar la oferta' });
          return;
        }

        if (result.affectedRows === 0) {
          res.status(404).json({ error: 'Oferta no encontrada' });
          return;
        }

        res.status(200).json({ mensaje: 'Oferta actualizada correctamente', actualizar: true });
      });
    } else {
      // Si no es "En proceso", sigue con la lógica de verificar postulaciones
      // Verifica si existen postulaciones aprobadas para la oferta
      const sqlVerificar = 'SELECT * FROM postulaciones WHERE id_oferta = ? AND estado = "Aceptada"';
      db.query(sqlVerificar, [id], (err, postulaciones) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error al verificar las postulaciones' });
          return;
        }

        if (postulaciones.length === 0) {
          // Envía una respuesta que el front-end puede manejar
          res.status(200).json({ mensaje: 'No hay postulaciones aprobadas', actualizar: false });
          return;
        }
        const sqlEliminar = 'DELETE FROM postulaciones WHERE id_oferta = ? AND estado != "Aceptada"';
        db.query(sqlEliminar, [id], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Error al eliminar postulaciones no aceptadas' });
            return;
          }
        
          // Si existen postulaciones aprobadas, procede a actualizar la oferta
          const sqlActualizar = 'UPDATE ofertas SET estado = ? WHERE id_oferta = ?';
          db.query(sqlActualizar, [nuevoEstado, id], (err, result) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: 'Error al actualizar la oferta' });
              return;
            }

            if (result.affectedRows === 0) {
              res.status(404).json({ error: 'Oferta no encontrada' });
              return;
            }

            res.status(200).json({ mensaje: 'Oferta actualizada correctamente', actualizar: true });
          });
        });
      }); // Esta es la coma que puede estar faltando o estar mal colocada.
    }
  });
});
app.delete('/api/ofertas/:id', (req, res) => {
  console.log(req.params)
  const { id } = req.params;

  // Aquí iría cualquier lógica de validación o autenticación necesaria...

  // Lógica para eliminar la oferta en la base de datos
  const sql = 'DELETE FROM ofertas WHERE id_oferta = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      // Manejo de errores de la base de datos
      console.error(err);
      res.status(500).send('Error al eliminar la oferta');
      return;
    }

    if (result.affectedRows === 0) {
      // Si no se encontraron filas afectadas, probablemente la oferta no existía
      res.status(404).send('Oferta no encontrada');
      return;
    }

    // Envía una confirmación de que la oferta fue eliminada
    res.status(200).send({ mensaje: 'Oferta eliminada correctamente' });
  });
});

app.delete('/api/postulaciones/:id', (req, res) => {
  console.log(req.params)
  const { id } = req.params;

  // Aquí iría cualquier lógica de validación o autenticación necesaria...

  // Lógica para eliminar la oferta en la base de datos
  const sql = 'DELETE FROM postulaciones WHERE id_postulacion = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      // Manejo de errores de la base de datos
      console.error(err);
      res.status(500).send('Error al eliminar la oferta');
      return;
    }

    if (result.affectedRows === 0) {
      // Si no se encontraron filas afectadas, probablemente la oferta no existía
      res.status(404).send('Oferta no encontrada');
      return;
    }

    // Envía una confirmación de que la oferta fue eliminada
    res.status(200).send({ mensaje: 'Oferta eliminada correctamente' });
  });
});

app.delete('/api/comentarios/borrar/:id/:idEmpresa', (req, res) => {
 
  const { id, idEmpresa } = req.params;
  console.log(req.params)
  // Aquí iría cualquier lógica de validación o autenticación necesaria...

  // Lógica para eliminar la oferta en la base de datos
  const sql = 'DELETE FROM feedbacks WHERE id_feedback = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      // Manejo de errores de la base de datos
      console.error(err);
      res.status(500).send('Error al eliminar la oferta');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).send('Comentario no encontrado');
      return;
    }
    
    const sqlCalcularPromedio = 'SELECT AVG(puntaje) as promedio FROM feedbacks WHERE id_empresa = ?';
    db.query(sqlCalcularPromedio, [idEmpresa], (err, resultPromedio) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al calcular el promedio');
        return;
      }

      const promedio = resultPromedio[0].promedio;

      // Actualizando la puntuación total en la tabla empresas
      const sqlActualizarEmpresa = 'UPDATE empresas SET puntuacion_total = ? WHERE id_empresa = ?';
      db.query(sqlActualizarEmpresa, [promedio, idEmpresa], (err, resultUpdate) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error al actualizar la puntuación en la empresa');
          return;
        }

        res.status(201).json({ promedioActualizado: promedio});
      });
    });
  });
});

app.post('/api/postulaciones/agregarEstudiante', (req, res) => {
  const { id_oferta, rutEstudiante } = req.body;
  const estado = 'Aceptada';
  const fecha = new Date().toISOString().slice(0, 10); // Formato AAAA-MM-DD

  // Primero, encontrar el id_estudiante basado en el rutEstudiante
  const sqlBuscarEstudiante = 'SELECT id_estudiante FROM estudiantes WHERE usuario = ?';
  db.query(sqlBuscarEstudiante, [rutEstudiante], (err, estudiantes) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al buscar el estudiante');
      return;
    }
    if (estudiantes.length === 0) {
      res.status(200).json({ mensaje: 'No hay estudiantes', agregar: false });
      return;
    }
    // Ahora que tenemos el id_estudiante, podemos insertar la postulación
    const id_estudiante = estudiantes[0].id_estudiante;
    const sqlInsertarPostulacion = 'INSERT INTO postulaciones (id_estudiante, id_oferta, fecha, estado) VALUES (?, ?, ?, ?)';
    db.query(sqlInsertarPostulacion, [id_estudiante, id_oferta, fecha, estado], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al registrar la postulación');
        return;
      }
      res.status(201).json({ postulacion: { id_postulacion: result.insertId, id_estudiante, id_oferta, fecha, estado }, agregar: true });
    });
  });
});

app.get('/api/comentarios/check/:id_estudiante', (req, res) => {
  const { id_estudiante } = req.params;
  const sql = 'SELECT * FROM feedbacks WHERE id_estudiante = ?';
  db.query(sql, [id_estudiante], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json({ alreadyApplied: result.length > 0 });
  });
});

app.post('/api/comentarios/agregar', (req, res) => {
  const {  id_empresa, id_estudiante, rating, comentario } = req.body;

  const fecha = new Date().toISOString().slice(0, 10); // Formato AAAA-MM-DD

  // Primero, encontrar el id_estudiante basado en el rutEstudiante
  

    const sqlInsertarComentario = 'INSERT INTO feedbacks (id_empresa, id_estudiante, puntaje, descripcion, fecha) VALUES (?, ?, ?, ?, ?)';
    db.query(sqlInsertarComentario, [id_empresa, id_estudiante, rating, comentario, fecha], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al registrar la postulación');
        return;
      }
      // Calculando el promedio de puntuaciones
    const sqlCalcularPromedio = 'SELECT AVG(puntaje) as promedio FROM feedbacks WHERE id_empresa = ?';
    db.query(sqlCalcularPromedio, [id_empresa], (err, resultPromedio) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al calcular el promedio');
        return;
      }

      const promedio = resultPromedio[0].promedio;

      // Actualizando la puntuación total en la tabla empresas
      const sqlActualizarEmpresa = 'UPDATE empresas SET puntuacion_total = ? WHERE id_empresa = ?';
      db.query(sqlActualizarEmpresa, [promedio, id_empresa], (err, resultUpdate) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error al actualizar la puntuación en la empresa');
          return;
        }

        res.status(201).json({ comentario: { id_feedback: result.insertId, id_empresa, id_estudiante, puntaje: rating, descripcion: comentario, fecha}, promedioActualizado: promedio, agregar: true });
      });
    });
  });
});

app.get('/api/postulacion/verificar/:id_estudiante/:id_empresa', (req, res) => {
  const { id_estudiante, id_empresa } = req.params;
  const sql = `
    SELECT p.* FROM postulaciones p
    INNER JOIN ofertas o ON p.id_oferta = o.id_oferta
    WHERE p.id_estudiante = ? AND o.id_empresa = ? AND p.estado = 'Aceptada'
  `;
  db.query(sql, [id_estudiante, id_empresa], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al verificar las postulaciones');
      return;
    }
    res.json({ tienePostulacionAceptada: result.length > 0 });
  });
});

app.put('/api/departamentos/actualizar/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, nombreAntiguo } = req.body;  // Asumiendo que también envías el nombre antiguo del departamento

  if (!nombre) {
    return res.status(400).send('El nombre del departamento es obligatorio');
  }

  const sqlActualizarDepartamento = 'UPDATE departamentos SET nombre = ? WHERE id_departamentos = ?';
  const sqlActualizarOfertas = 'UPDATE ofertas SET departamento = ? WHERE departamento = ?';

  db.query(sqlActualizarDepartamento, [nombre, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al actualizar el departamento');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Departamento no encontrado');
    }

    // Actualizar las ofertas asociadas a este departamento
    db.query(sqlActualizarOfertas, [nombre, nombreAntiguo], (err, resultOfertas) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al actualizar las ofertas');
      }

      res.status(200).send({ mensaje: 'Departamento y ofertas actualizados correctamente' });
    });
  });
});


app.delete('/api/departamentos/eliminar/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sqlEsOtro = 'SELECT nombre FROM departamentos WHERE id_departamentos = ?';
    const [departamento] = await db.promise().query(sqlEsOtro, [id]);

    if (departamento[0].nombre === 'Otro') {
      // Verificar si hay ofertas asignadas a 'Otro'
      const sqlVerificarOfertas = 'SELECT COUNT(*) AS count FROM ofertas WHERE departamento = "Otro"';
      const [ofertas] = await db.promise().query(sqlVerificarOfertas);

      if (ofertas[0].count > 0) {
        return res.json({ mensaje: 'Hay una oferta en otro', ofertaOtro: true });
      }
    }
    // Verificar si hay ofertas en el departamento a eliminar
    const sqlVerificarOfertas = 'SELECT COUNT(*) AS count FROM ofertas WHERE departamento = (SELECT nombre FROM departamentos WHERE id_departamentos = ?)';
    const [ofertas] = await db.promise().query(sqlVerificarOfertas, [id]);

    let otroCreado = false;
    let departamentoOtro = null;

    if (ofertas[0].count > 0) {
      // Verificar si existe el departamento 'Otro'
      const sqlBuscarDepartamentoOtro = 'SELECT id_departamentos FROM departamentos WHERE nombre = "Otro" AND id_empresa = (SELECT id_empresa FROM departamentos WHERE id_departamentos = ?)';
      const [otro] = await db.promise().query(sqlBuscarDepartamentoOtro, [id]);

      // Si no existe, crearlo
      if (otro.length === 0) {
        const sqlObtenerIdEmpresa = 'SELECT id_empresa FROM departamentos WHERE id_departamentos = ?';
        const [empresa] = await db.promise().query(sqlObtenerIdEmpresa, [id]);

        if (empresa.length > 0) {
          const id_empresa = empresa[0].id_empresa;
          const sqlCrearDepartamentoOtro = 'INSERT INTO departamentos (nombre, id_empresa) VALUES ("Otro", ?)';
          const [insertResult] = await db.promise().query(sqlCrearDepartamentoOtro, [id_empresa]);
          otroCreado = true;
          departamentoOtro = { id_departamentos: insertResult.insertId, nombre: 'Otro', id_empresa: id_empresa };
        }
      }

      // Mover las ofertas al departamento 'Otro'
      const sqlMoverOfertas = 'UPDATE ofertas SET departamento = "Otro" WHERE departamento = (SELECT nombre FROM departamentos WHERE id_departamentos = ?)';
      await db.promise().query(sqlMoverOfertas, [id]);
    }

    // Eliminar el departamento
    const sqlEliminarDepartamento = 'DELETE FROM departamentos WHERE id_departamentos = ?';
    const [result] = await db.promise().query(sqlEliminarDepartamento, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send('Departamento no encontrado');
    }

    res.json({ mensaje: 'Departamento eliminado y ofertas actualizadas correctamente', otroCreado, departamentoOtro });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar el departamento');
  }
});





app.get('/api/departamentos/check/:nombre', (req, res) => {
  const { nombre } = req.params;
  
  const sql = 'SELECT COUNT(*) AS count FROM departamentos WHERE nombre = ?';
  db.query(sql, [nombre], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al verificar el departamento');
    }

    if (result[0].count > 0) {
      res.json({ existe: true });
    } else {
      res.json({ existe: false });
    }
  });
});

app.get('/api/buscarEmpresas', (req, res) => {
  const { empresa, ordenar } = req.query;
  if (!empresa || empresa.trim() === '') {
    // Si está vacío, no devolver ningún estudiante
    return res.status(400).send('El término de búsqueda está vacío');
  }
  let baseSQL = `
    SELECT 
      empresas.*, 
      COUNT(ofertas.id_oferta) AS cantidad_ofertas,
      (SELECT COUNT(*) FROM postulaciones 
        JOIN ofertas ON postulaciones.id_oferta = ofertas.id_oferta
        WHERE ofertas.id_empresa = empresas.id_empresa) AS cantidad_postulaciones
    FROM empresas
  `;
  let joinClause = 'LEFT JOIN ofertas ON empresas.id_empresa = ofertas.id_empresa';
  let whereClauses = [];
  let groupByClause = 'GROUP BY empresas.id_empresa';
  let orderClause = '';

  if (empresa) {
    whereClauses.push(`(empresas.nombre LIKE '%${empresa}%' OR empresas.descripcion LIKE '%${empresa}%')`);
  }

  if (ordenar === 'valoracion') {
    orderClause = 'ORDER BY empresas.puntuacion_total DESC';
  } else if (ordenar === 'popularidad') {
    orderClause = 'ORDER BY cantidad_postulaciones DESC';
  } else if (ordenar === 'ofertas') {
    orderClause = 'ORDER BY cantidad_ofertas DESC';
  }

  let sql = `${baseSQL} ${joinClause} ${whereClauses.length > 0 ? 'WHERE ' + whereClauses.join(' AND ') : ''} ${groupByClause} ${orderClause}`;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error al realizar la búsqueda');
    }
    res.send(result);
  });
});

app.get('/api/buscarEstudiantes', (req, res) => {
  const { estudiante } = req.query;
  if (!estudiante || estudiante.trim() === '') {
    // Si está vacío, no devolver ningún estudiante
    return res.status(400).send('El término de búsqueda está vacío');
  }
  let sql = `
    SELECT * FROM estudiantes 
    WHERE 
      nombre LIKE ? OR 
      carrera LIKE ? OR 
      especialidad LIKE ? OR 
      descripcion LIKE ? OR 
      intereses LIKE ? OR 
      proyectos LIKE ? OR 
      habilidades LIKE ? OR 
      conocimientos LIKE ? OR 
      estudios LIKE ? OR 
      calle_numero LIKE ? OR 
      region LIKE ? OR 
      comuna LIKE ?
  `;

  let searchQuery = `%${estudiante}%`;
  let queryValues = Array(14).fill(searchQuery); // 14 campos a buscar

  db.query(sql, queryValues, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error al realizar la búsqueda');
    }
    res.send(result);
  });
});
