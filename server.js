const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3000;

// Настройка CORS и JSON парсера
app.use(cors());
app.use(express.json());

// Конфигурация БД
const dbConfig = {
    host: "localhost",
    user: "root",
    database: "TestAvtorization",
    password: "12345AZD",
    port: 3006
};
app.get('/users', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`SELECT * FROM users`);
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error('Ошибка при получении данных:', err);
        res.status(500).send('Ошибка сервера');
    }
});
app.post('/register', async (req, res) => {
    try {
        const { name, phone, email, college, role, date } = req.body;

        if (!name || !phone || !email || !college || !role) {
            return res.status(400).json({ message: "Заполните все поля" });
        }

        const connection = await mysql.createConnection(dbConfig);

        // Проверяем существование email
        const [existingUser] = await connection.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            await connection.end();
            return res.status(400).json({ message: "Пользователь с таким Email уже существует" });
        }

        // Добавляем нового пользователя
        await connection.execute(
            "INSERT INTO users (name, number, email, college, status, registration_date) VALUES (?, ?, ?, ?, ?, ?)",
            [name, phone, email, college, role, date]
        );

        await connection.end();
        res.json({ message: "Вы зарегистрированы! Проверьте свою почту." });

    } catch (err) {
        console.error('Ошибка при регистрации:', err);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});


// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен: http://localhost:${port}`);
});
