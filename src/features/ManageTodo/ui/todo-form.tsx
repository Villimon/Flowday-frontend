import { ApiError } from '@/shared/types/api.types';
import { TodoFormData, todoSchema } from '../model/schema/schema';
import { Button, HStack, Input, Text, VStack } from '@/shared/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC, memo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Textarea } from '@/shared/ui/Textarea/Textarea';
import { LabelList, useLabels } from '@/entities/Label';
import { CreateLabel } from '@/features/CreateLabel';
import { Loader } from '@/shared/ui/Loader/Loader';
import styles from './todo-form.module.css';
import { useMedia } from '@/shared/hooks/useDevice/useDevice';

interface TodoFormProps {
    onCancel: () => void;
    onSubmit: (value: TodoFormData) => Promise<void>;
    isLoading: boolean;
    error: ApiError | null;
    submitText: string;
    initialData?: Partial<TodoFormData> | null;
}

export const TodoForm: FC<TodoFormProps> = memo(
    ({ error, initialData, isLoading, onCancel, onSubmit, submitText }) => {
        const ref = useRef<HTMLInputElement>(null);
        const { data: labels, isLoading: labelsLoading } = useLabels();
        const isTablet = useMedia('(max-width: 768px)');

        const { control, handleSubmit } = useForm<TodoFormData>({
            resolver: zodResolver(todoSchema),
            defaultValues: {
                title: '',
                description: '',
                labels: [],
                ...initialData,
            },
            mode: 'onSubmit',
            reValidateMode: 'onBlur',
        });

        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                {labelsLoading ? (
                    <div>
                        <Loader className={styles.loader} />
                    </div>
                ) : (
                    <VStack gap={isTablet ? '24' : '8'} fullWidth>
                        <VStack gap="4" fullWidth>
                            <Controller
                                name="title"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Input
                                        {...field}
                                        ref={ref}
                                        data-testid="todo-title-input"
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
                                    <Textarea
                                        {...field}
                                        data-testid="todo-description-input"
                                        label="Описание задачи"
                                        placeholder="Введите описание"
                                        size="md"
                                        rows={3}
                                        autoResize
                                        error={fieldState.error?.message}
                                        hint="Максимум 1000 символов"
                                        disabled={isLoading}
                                        aria-describedby={
                                            fieldState.error
                                                ? 'description-error'
                                                : 'description-description'
                                        }
                                    />
                                )}
                            />
                            <VStack gap="4" fullWidth>
                                <CreateLabel />
                                <Controller
                                    name="labels"
                                    control={control}
                                    render={({ field }) => {
                                        const currentLabels = Array.isArray(field.value)
                                            ? field.value
                                            : [];

                                        const handleSelect = (id: string) => {
                                            if (id === '') {
                                                field.onChange([]);
                                                return;
                                            }

                                            const nextLabels = currentLabels.includes(id)
                                                ? currentLabels.filter(labelId => labelId !== id)
                                                : [...currentLabels, id];

                                            field.onChange(nextLabels);
                                        };

                                        return (
                                            <LabelList
                                                onChange={handleSelect}
                                                activeLabels={currentLabels}
                                                labels={labels?.data}
                                            />
                                        );
                                    }}
                                />
                            </VStack>
                            {error && <Text variant="error" text={error.message} size="sm" />}
                        </VStack>
                        <HStack fullWidth gap="4" justify="end">
                            <Button disabled={isLoading} variant="outline" onClick={onCancel}>
                                Отмена
                            </Button>
                            <Button
                                loading={isLoading}
                                disabled={isLoading}
                                variant="filled"
                                type="submit"
                                data-testid="submit-todo-button"
                            >
                                {submitText}
                            </Button>
                        </HStack>
                    </VStack>
                )}
            </form>
        );
    }
);

TodoForm.displayName = 'TodoForm';
