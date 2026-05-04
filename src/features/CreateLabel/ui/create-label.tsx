import { Button, Card, HStack, Input, Text, VStack } from '@/shared/ui';
import { useCallback, useRef, useState } from 'react';
import PlusIcon from '@/shared/assets/plus.svg';
import styles from './create-label.module.css';
import { LabelFormData, labelSchema } from '../model/schema/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useCreateLabel } from '../api/create-label';
import { toast } from 'react-toastify';

export const CreateLabel = () => {
    const [showFormLabel, setShowFormLabel] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const { control, handleSubmit, reset, watch } = useForm<LabelFormData>({
        resolver: zodResolver(labelSchema),
        defaultValues: {
            name: '',
        },
        mode: 'onSubmit',
        reValidateMode: 'onBlur',
    });

    const nameValue = watch('name'); // eslint-disable-line react-hooks/incompatible-library

    const handleClick = useCallback(() => {
        setShowFormLabel(prev => !prev);
    }, []);

    const handleClose = useCallback(() => {
        setShowFormLabel(false);
    }, []);

    const {
        mutate: createLabelMutate,
        error: createLabelError,
        isPending,
        reset: resetMutation,
    } = useCreateLabel();

    const handleCreateLable = useCallback(
        (value: LabelFormData) => {
            resetMutation();
            createLabelMutate(value, {
                onSuccess: () => {
                    toast.success('Метка успешно создана');
                    handleClose();
                    reset();
                },
                onError: error => {
                    toast.error(error.message || 'Ошибка при создание метки');
                },
            });
        },
        [createLabelMutate, handleClose, resetMutation, reset]
    );

    const onSubmit = handleSubmit(handleCreateLable);

    return (
        <VStack fullWidth gap="2">
            <HStack fullWidth gap="2" justify="between">
                <Text size="sm" weight="medium">
                    Метка <span className={styles.optional}>(необязательно)</span>
                </Text>
                <Button icon={PlusIcon} radius="xl" size="sm" onClick={handleClick} variant="clear">
                    Новая метка
                </Button>
            </HStack>

            {showFormLabel && (
                <Card radius="xl" padding="4" fullWidth>
                    <HStack fullWidth gap="4">
                        <VStack fullWidth gap="2">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Input
                                        {...field}
                                        ref={ref}
                                        placeholder="Название метки"
                                        autoFocus
                                        aria-required="true"
                                        required
                                        error={fieldState.error?.message}
                                        isInvalid={!!fieldState.error}
                                        autoComplete="name"
                                        disabled={isPending}
                                        size="xs"
                                        radius="lg"
                                        aria-describedby={
                                            fieldState.error ? 'name-error' : 'name-description'
                                        }
                                    />
                                )}
                            />
                            {createLabelError && (
                                <Text variant="error" text={createLabelError.message} size="sm" />
                            )}
                        </VStack>
                        <Button
                            loading={isPending}
                            type="submit"
                            size="xs"
                            radius="lg"
                            variant="filled"
                            onClick={onSubmit}
                            disabled={!nameValue.trim().length}
                        >
                            Добавить
                        </Button>
                        <Button
                            iconOnly
                            icon={PlusIcon}
                            iconClassName={styles.icon}
                            variant="ghost"
                            radius="lg"
                            size="xs"
                            onClick={handleClose}
                            disabled={isPending}
                        />
                    </HStack>
                </Card>
            )}
        </VStack>
    );
};
