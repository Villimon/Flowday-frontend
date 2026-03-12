import { TodoFormData, todoSchema } from '../model/schema/schema';
import { Button, HStack, Input, Text, VStack } from '@/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface TodoFormProps {
    onCancel: () => void;
    onSubmit: (value: TodoFormData) => Promise<void>;
    isLoading: boolean;
    error: Error | null;
    submitText: any;
    initialData?: Partial<TodoFormData>;
}

export const TodoForm: FC<TodoFormProps> = ({
    error,
    initialData,
    isLoading,
    onCancel,
    onSubmit,
    submitText,
}) => {
    const ref = useRef<HTMLInputElement>(null);
    const { control, handleSubmit } = useForm<TodoFormData>({
        resolver: zodResolver(todoSchema),
        defaultValues: {
            title: '',
            description: '',
            ...initialData,
        },
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                                disabled={isLoading}
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
                                disabled={isLoading}
                                aria-describedby={
                                    fieldState.error
                                        ? 'description-error'
                                        : 'description-description'
                                }
                            />
                        )}
                    />
                    {error && <Text variant="error" text={error.message} size="sm" />}
                </VStack>
                <HStack fullWidth gap="4" justify="end">
                    <Button loading={isLoading} disabled={isLoading} variant="filled" type="submit">
                        {submitText}
                    </Button>
                    <Button
                        loading={isLoading}
                        disabled={isLoading}
                        variant="outline"
                        onClick={onCancel}
                    >
                        Отмена
                    </Button>
                </HStack>
            </VStack>
        </form>
    );
};
