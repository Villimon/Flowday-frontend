import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';
import todoRoutes from './routes/todos/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.resolve(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(async (req, res, next) => {
    await new Promise(res => {
        setTimeout(res, 800);
    });
    next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// auth
server.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        const { db } = router;
        const userFromBd = db.get('users').find({ email, password }).value();

        if (!userFromBd) {
            return res.status(403).json({ message: 'Неправильный логин или пароль' });
        }

        res.status(201).json({
            success: true,
            message: 'Успешная авторизация',
            data: {
                name: userFromBd.name,
                email: userFromBd.email,
                token: userFromBd.token,
                id: userFromBd.id,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

server.post('/api/auth/register', (req, res) => {
    try {
        const { email, password, name } = req.body;
        const { db } = router;
        const users = db.get('users');

        const exists = users.find({ email }).value();
        if (exists) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        const newUser = {
            id: String(Date.now()),
            email,
            password,
            name,
            token: `token-${String(Date.now())}`,
        };

        users.push(newUser).write();

        res.status(201).json({
            success: true,
            message: 'Пользователь успешно создан',
            data: {
                name: newUser.name,
                email: newUser.email,
                token: newUser.token,
                id: newUser.id,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

server.get('/api/auth/me', (req, res) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

        const { db } = router;
        const userFromBd = db.get('users').find({ token }).value();

        if (!userFromBd) {
            return res.status(403).json({ message: 'Нет такого пользователя' });
        }

        res.status(200).json({
            success: true,
            data: {
                name: userFromBd.name,
                email: userFromBd.email,
                id: userFromBd.id,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

export const LABEL_COLORS = [
    '#FF6B6B', // красный
    '#4ECDC4', // бирюзовый
    '#45B7D1', // голубой
    '#96CEB4', // мятный
    '#FFEAA7', // песочный
    '#DDA0DD', // сливовый
    '#98D8C8', // аквамарин
    '#F7DC6F', // желтый
    '#BB8FCE', // фиолетовый
    '#85C1E2', // небесный
    '#F1948A', // лососевый
    '#82E0AA', // зеленый
    '#F5B041', // оранжевый
    '#5DADE2', // синий
    '#E74C3C', // темно-красный
    '#2ECC71', // изумрудный
    '#F39C12', // мандарин
    '#1ABC9C', // темно-бирюзовый
    '#3498DB', // королевский синий
    '#9B59B6', // аметист
];

// labels
server.post('/api/labels', (req, res) => {
    try {
        const userId = req.headers.userid;
        const { name } = req.body;
        const { db } = router;

        const existingLabel = db.get('labels').find({ userId, name: name.trim() }).value();

        if (existingLabel) {
            return res.status(400).json({
                success: false,
                message: `Метка с именем "${name}" уже существует`,
            });
        }

        const userLabels = db.get('labels').filter({ userId }).value();
        const labelCount = userLabels.length;
        const colorIndex = labelCount % LABEL_COLORS.length;

        const newLabel = {
            id: String(Date.now()),
            name,
            userId,
            color: LABEL_COLORS[colorIndex],
        };

        const labels = db.get('labels');

        labels.push(newLabel).write();

        res.status(201).json({
            success: true,
            message: 'Лейбл успешно создан',
            data: newLabel,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

server.delete('/api/labels/:id', (req, res) => {
    try {
        const userId = req.headers.userid;
        const labelId = req.params.id;
        const { db } = router;

        db.get('labels').remove({ id: labelId, userId }).write();

        const todos = db.get('todos').filter({ userId }).value();

        todos.forEach(todo => {
            if (todo.labels && todo.labels.includes(labelId)) {
                db.get('todos')
                    .find({ id: todo.id })
                    .assign({
                        labels: todo.labels.filter(id => id !== labelId),
                        updatedAt: new Date().toISOString(),
                    })
                    .write();
            }
        });

        res.status(200).json({
            success: true,
            message: 'Лейбл успешно удален',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

server.get('/api/labels', (req, res) => {
    try {
        const userId = req.headers.userid;
        const { db } = router;

        const labels = db.get('labels').filter({ userId }).value();

        res.status(200).json({
            success: true,
            message: 'Метки получены',
            data: labels,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

// for cypress test
server.post('/api/test/reset', (req, res) => {
    try {
        const userId = req.headers.userid;
        const { db } = router;

        // Удаляем все задачи пользователя
        const todos = db.get('todos').remove({ userId }).write();

        // Удаляем все метки пользователя
        const labels = db.get('labels').remove({ userId }).write();

        console.log(
            `🧹 Database cleared for user ${userId}: deleted ${todos.length} todos and ${labels.length} labels`
        );

        res.status(200).json({
            success: true,
            message: 'Database cleared successfully',
            data: {
                todosDeleted: todos.length,
                labelsDeleted: labels.length,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

server.use(async (req, res, next) => {
    try {
        // Пропускаем публичные роуты (логин, регистрация)
        if (req.path === '/api/auth/login' || req.path === '/api/auth/register') {
            return next();
        }

        const token = req.headers.authorization;

        if (!token) {
            return res.status(403).json({ message: 'AUTH ERROR' });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

todoRoutes(server, router);

server.use('/api', router);

server.listen(8000, () => {
    console.log('JSON Server is running');
});
