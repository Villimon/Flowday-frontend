import { enrichTodoWithLabels } from './enrichTodoWithLabels.js';

export const enrichTodosWithLabels = (todos, db) => {
    return todos.map(todo => enrichTodoWithLabels(todo, db));
};
