import jsonServer from 'json-server';
import path from 'path';
import { fileURLToPath } from 'url';

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

// todos
server.post('/api/todos', (req, res) => {
    try {
        const userId = req.headers.userid;
        const { title, description, labels } = req.body;

        const newTodo = {
            id: String(Date.now()),
            title,
            description,
            completed: false,
            userId,
            labels, 
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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


const enrichTodoWithLabels = (todo, db) => {
    if (!todo.labels || todo.labels.length === 0) {
        return { ...todo, labels: [] };
    }
    
    // Получаем полные объекты меток
    const enrichedLabels = todo.labels
        .map(labelId => db.get('labels').find({ id: labelId }).value())
        .filter(label => label !== undefined); // удаляем несуществующие
    
    return {
        ...todo,
        labels: enrichedLabels
    };
};

// Функция для обогащения всех задач
const enrichTodosWithLabels = (todos, db) => {
    return todos.map(todo => enrichTodoWithLabels(todo, db));
};

server.get('/api/todos', (req, res) => {
    try {
        const userId = req.headers.userid;
        const { status } = req.query;
        let todos;

        const { db } = router;

        if (status === 'active') {
            todos = db.get('todos').filter({ userId, completed: false }).value();
        } else if (status === 'completed') {
            todos = db.get('todos').filter({ userId, completed: true }).value();
        } else {
            todos = db.get('todos').filter({ userId }).value();
        }

        const activeTodos = todos.filter(t => !t.completed);
        const completedTodos = todos.filter(t => t.completed);

        // Сортируем активные по createdAt (новые сверху)
        activeTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        // Сортируем выполненные по updatedAt (новые сверху)
        completedTodos.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        // Объединяем: сначала активные, потом выполненные
        let sortedTodos = [...activeTodos, ...completedTodos];

        // Если есть фильтр, применяем его
        if (status === 'active') {
            sortedTodos = activeTodos;
        } else if (status === 'completed') {
            sortedTodos = completedTodos;
        }

        const enrichedTodos = enrichTodosWithLabels(sortedTodos, db);

        res.status(200).json({
            success: true,
            message: 'Задачи получены',
            data: enrichedTodos,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

server.patch('/api/todos/:id/toggle', (req, res) => {
    try {
        const userId = req.headers.userid;
        const todoId = req.params.id;

        const { db } = router;

        const todo = db.get('todos').find({ userId, id: todoId }).value();

        if (!todo) {
            return res.status(404).json({
                message: 'Задача не найдена',
            });
        }

        todo.completed = !todo.completed;
        todo.updatedAt = new Date().toISOString();

        db.get('todos')
            .find({ id: todoId, userId })
            .assign({
                completed: todo.completed,
                updatedAt: todo.updatedAt,
            })
            .write();

        res.status(200).json({
            success: true,
            message: 'Статус задачи успешно изменен',
            data: todo,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
});

server.put('/api/todos/:id', (req, res) => {
    try {
        const data = req.body;
        const userId = req.headers.userid;
        const todoId = req.params.id;

        const { db } = router;

        const todo = db.get('todos').find({ userId, id: todoId }).value();

        if (!todo) {
            return res.status(404).json({
                message: 'Задача не найдена',
            });
        }

        const updatedTodo = {
            ...todo,
            updatedAt: new Date().toISOString(),
            title: data.title,
            description: data.description,
            labels: data.labels
        };

        db.get('todos').find({ id: todoId, userId }).assign(updatedTodo).write();

        res.status(200).json({
            success: true,
            message: 'Задачи успешно изменена',
            data: updatedTodo,
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

        const existingLabel = db.get('labels')
            .find({ userId, name: name.trim() })
            .value();

        if (existingLabel) {
            return res.status(400).json({
                success: false,
                message: `Метка с именем "${name}" уже существует`
            });
        }

        const userLabels = db.get('labels').filter({ userId }).value();
        const labelCount = userLabels.length;
        const colorIndex = labelCount % LABEL_COLORS.length;


        const newLabel = {
            id: String(Date.now()),
            name,
            userId,
            color: LABEL_COLORS[colorIndex]
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
