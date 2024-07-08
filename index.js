import express from 'express';
import bodyParser from 'body-parser';
import connection from './config/db.js';


const app = express();

app.use(express.json());
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('<h1>Hola desde el back</h1>')
})

app.post('/clientes', async (req, res) => {
    let { nombre, email, password } = await req.body;
    console.log(nombre)
    console.log(email)
    console.log(password)
    // let nombre = req.params.nombre
    // let email = req.params.email
    // let password = req.params.password
    let query = 'INSERT INTO clientes (nombre, email, password) VALUES (?, ?, ?)';

    try {
        const [result] = await connection.execute(query, [nombre, email, password]);
        res.status(201).json({ message: 'Usuario creado', result });
    } catch (error) {
        console.error('Error al insertar en la base de datos:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
})

app.get('/clientes', async (req, res) => {
    let [result] = await connection.execute('SELECT * FROM clientes'); //traes contraseñas y todo (!!!!!)
    res.json(result)
})

app.put('/clientes/:id', async (req, res) => {
    const { nombre } = await req.body
    const id = req.params.id;
    console.log(id)
    console.log(nombre)
    let query = 'UPDATE clientes SET nombre = ? WHERE id = ?'
    let [result] = await connection.execute(query, [nombre, id])
    res.status(200).json({ message: `Usuario con id: ${id} actualizado a: ${nombre}` })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Escuchado en http://localhost:3000');
})
