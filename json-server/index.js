const jsonServer = require('json-server');
const path = require('path');

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
            token: 'qweasdzxc',
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

server.post('/api/todos', (req, res) => {
    try {
        const userId = req.headers.userid;
        const { title, description } = req.body;

        const newTodo = {
            id: String(Date.now()),
            title,
            description,
            complited: false,
            userId,
            createdAt: Date.now(),
        };

        const { db } = router;
        const todos = db.get('todos');

        todos.push(newTodo).write();

        res.status(201).json({
            success: true,
            message: 'Задача успешно создана',
            data: newTodo,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

server.get('/api/todos', (req, res) => {
    try {
        const userId = req.headers.userid;

        const { db } = router;
        let todos = db.get('todos').filter({ userId }).value();

        todos = todos.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.status(200).json({
            success: true,
            message: 'Задачи получены',
            data: todos,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
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

// require('./routes/dialog/index')(server, router)
// require('./routes/user/index')(server, router)
// require('./routes/session/index')(server, router)

server.use('/api', router);

server.listen(8000, () => {
    console.log('JSON Server is running');
});
