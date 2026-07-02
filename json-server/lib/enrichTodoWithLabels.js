export const enrichTodoWithLabels = (todo, db) => {
    if (!todo.labels || todo.labels.length === 0) {
        return { ...todo, labels: [] };
    }

    // Получаем полные объекты меток
    const enrichedLabels = todo.labels
        .map(labelId => db.get('labels').find({ id: labelId }).value())
        .filter(label => label !== undefined);

    return {
        ...todo,
        labels: enrichedLabels,
    };
};
