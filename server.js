require('dotenv').config({ path: '.env.development.local' });
const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar pool de Postgres
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inicializar DB
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS items (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                completed BOOLEAN DEFAULT false
            );
        `);
        console.log("Tabla 'items' verificada/creada con éxito.");
    } catch (err) {
        console.error("Error inicializando la base de datos:", err);
    }
};
initDB();

// --- API Routes ---

// Obtener todos los ítems
app.get('/api/items', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM items ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Añadir un nuevo ítem
app.post('/api/items', async (req, res) => {
    const { name } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO items (name) VALUES ($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Marcar/Desmarcar un ítem como completado
app.put('/api/items/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    try {
        const result = await pool.query(
            'UPDATE items SET completed = $1 WHERE id = $2 RETURNING *',
            [completed, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ítem no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Borrar toda la lista
app.delete('/api/items', async (req, res) => {
    try {
        await pool.query('DELETE FROM items');
        res.json({ message: 'Todos los ítems borrados' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Exportar app para Vercel Serverless o iniciar servidor local
if (process.env.NODE_ENV !== 'production' && require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;
