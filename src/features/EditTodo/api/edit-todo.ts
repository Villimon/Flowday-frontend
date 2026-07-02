import { $api } from '@/shared/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TODO_KEYS } from '@/shared/api/keys-factories/create-todo-factories';
import { ManageTodoResponseDto } from '@/features/ManageTodo';
import { AxiosError } from 'axios';
import { ApiError } from '@/shared/types/api.types';
import { EditTodoDto } from '@/features/EditTodo/model/types/types';
import { getTodoCategory, Todo } from '@/entities/Todos';
import { Label, LabelResponseDto } from '@/entities/Label/model/types/types';
import { LABEL_KEYS } from '@/shared/api/keys-factories/create-label-factories';
import {
    DataType,
    GetTodosDayResponse,
    GetTodosListResponse,
} from '@/entities/Todos/model/types/types';
import { sortTodosForClient } from '@/shared/lib/sortTodosForClient';

export const useEditTodo = () => {
    const queryClient = useQueryClient();

    return useMutation<Todo, ApiError, EditTodoDto>({
        mutationFn: async (dto: EditTodoDto) => {
            try {
                const { data } = await $api.put<ManageTodoResponseDto>(
                    `/todos/${dto.todoId}`,
                    dto.todo
                );
                return data.data;
            } catch (e) {
                const error = e as AxiosError<ApiError>;
                throw (
                    error.response?.data || {
                        success: false,
                        message: 'Ошибка при обновлении задачи',
                    }
                );
            }
        },
        onSuccess: async updatedTodo => {
            queryClient.setQueriesData<DataType>({ queryKey: TODO_KEYS.lists() }, old => {
                if (!old || !old.todos) return old;

                const todoId = updatedTodo.id;

                if ('withDate' in old.todos) {
                    // Проверяем, в каком массиве она лежала раньше
                    const isInWithDate = old.todos.withDate.some(t => t.id === todoId);
                    const isInWithoutDate = old.todos.withoutDate.some(t => t.id === todoId);

                    // Если её вообще не нашли в этом кэше (например, это другой экран), возвращаем как есть
                    if (!isInWithDate && !isInWithoutDate) return old;

                    // Фильтруем (удаляем из старых мест)
                    const cleanWithDate = old.todos.withDate.filter(t => t.id !== todoId);
                    const cleanWithoutDate = old.todos.withoutDate.filter(t => t.id !== todoId);

                    // Определяем новое место на режиме Дня: если даты нет — в withoutDate, если есть — в withDate
                    const hasDate = !!(updatedTodo.startDate || updatedTodo.endDate);

                    return {
                        ...old,
                        todos: {
                            withDate: hasDate
                                ? sortTodosForClient([updatedTodo, ...cleanWithDate])
                                : cleanWithDate,
                            withoutDate: !hasDate
                                ? sortTodosForClient([updatedTodo, ...cleanWithoutDate])
                                : cleanWithoutDate,
                        },
                    } as GetTodosDayResponse;
                }

                if ('today' in old.todos) {
                    const isCompleted = updatedTodo.completed;

                    const filterOut = (arr: Todo[]) => arr.filter(t => t.id !== todoId);

                    const cleanTodos = {
                        overdue: filterOut(old.todos.overdue),
                        today: filterOut(old.todos.today),
                        thisWeek: filterOut(old.todos.thisWeek),
                        upcoming: filterOut(old.todos.upcoming),
                        withoutDate: filterOut(old.todos.withoutDate),
                        completed: filterOut(old.todos.completed),
                    };

                    if (isCompleted) {
                        cleanTodos.completed = sortTodosForClient([
                            updatedTodo,
                            ...cleanTodos.completed,
                        ]);
                    } else {
                        const targetCategory = getTodoCategory(updatedTodo);

                        cleanTodos[targetCategory] = sortTodosForClient([
                            updatedTodo,
                            ...cleanTodos[targetCategory],
                        ]);
                    }

                    return {
                        ...old,
                        todos: cleanTodos,
                    } as GetTodosListResponse;
                }

                return old;
            });

            queryClient.invalidateQueries({ queryKey: TODO_KEYS.lists() });
        },
    });
};
