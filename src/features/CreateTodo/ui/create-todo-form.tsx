import { useCreateTodo } from '../api/create-todo';
import { CreateTodoFormData, createTodoSchema } from '../model/schema/schema';
import { Button, HStack, Input, Text, VStack } from '@/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useCallback, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

interface CreateTodoFormProps {
    onClose: () => void;
}

export const CreateTodoForm: FC<CreateTodoFormProps> = ({ onClose }) => {
    const ref = useRef<HTMLInputElement>(null);
    const { control, handleSubmit, reset } = useForm<CreateTodoFormData>({
        resolver: zodResolver(createTodoSchema),
        defaultValues: {
            title: '',
            description: '',
        },
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    });

    const {
        mutateAsync: createTodoMutate,
        error: mutationError,
        isPending,
        reset: resetMutation,
    } = useCreateTodo();

    const handleCloseModal = useCallback(() => {
        onClose();
        reset();
    }, [reset]);

    const handleCreateTodo = useCallback(
        async (value: CreateTodoFormData) => {
            resetMutation();
            try {
                await createTodoMutate(value);
                toast.success(`Задача создана`);
                handleCloseModal();
            } catch (error: any) {
                toast.error(error.message || 'Ошибка при создание');
            }
        },
        [createTodoMutate, resetMutation]
    );

    return (
        <form onSubmit={handleSubmit(handleCreateTodo)}>
            <VStack gap="8" fullWidth>
                <VStack gap="4" fullWidth>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                ref={ref}
                                placeholder="Введите название задачи"
                                autoFocus
                                aria-required="true"
                                required
                                error={fieldState.error?.message}
                                isInvalid={!!fieldState.error}
                                label="Название задачи"
                                disabled={isPending}
                                aria-describedby={
                                    fieldState.error ? 'title-error' : 'title-description'
                                }
                            />
                        )}
                    />
                    <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Input
                                {...field}
                                placeholder="Введите описание"
                                error={fieldState.error?.message}
                                isInvalid={!!fieldState.error}
                                label="Описание задачи"
                                disabled={isPending}
                                aria-describedby={
                                    fieldState.error
                                        ? 'description-error'
                                        : 'description-description'
                                }
                            />
                        )}
                    />
                    {mutationError && (
                        <Text variant="error" text={mutationError.message} size="sm" />
                    )}
                </VStack>
                <HStack fullWidth gap="4" justify="end">
                    <Button loading={isPending} disabled={isPending} variant="filled" type="submit">
                        Создать
                    </Button>
                    <Button
                        loading={isPending}
                        disabled={isPending}
                        variant="outline"
                        onClick={handleCloseModal}
                    >
                        Отмена
                    </Button>
                </HStack>
            </VStack>
        </form>
    );
};
