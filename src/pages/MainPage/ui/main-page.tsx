import { Button, Card, HStack, Input, Modal, Text, VStack } from '@/shared/ui';
import { memo, useState } from 'react';

export const MainPage = memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const auth = false;
    return (
        <main>
            <p>Информация о сайте</p>
            {auth ? (
                <button>Перейти к работе с задачи</button>
            ) : (
                <button>Войти, чтобы начать работу</button>
            )}
            <Button onClick={() => setIsOpen(true)}>Открыть модалку</Button>;
            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Создать задачу"
                description="Зарегистрируейте чела"
            >
                <VStack gap="4">
                    <Text>Описание модалки</Text>
                    <Button onClick={() => setIsOpen(false)}>Закрыть</Button>
                </VStack>
            </Modal>
            <VStack gap="8">
                // Базовое использование
                <Input label="Название задачи" placeholder="Введите название задачи..." />
                // С ошибкой
                <Input label="Email" error="Введите корректный email" isInvalid />
                // Разные размеры
                <Input size="xs" placeholder="Очень маленький" />
                <Input size="sm" placeholder="Маленький" />
                <Input size="md" placeholder="Средний (по умолчанию)" />
                <Input size="lg" placeholder="Большой" />
                <Input size="xl" placeholder="Очень большой" />
                // Разные варианты
                <Input variant="outline" label="Outline (по умолчанию)" />
                <Input variant="filled" label="Filled" />
                <Input variant="ghost" label="Ghost" placeholder="Ghost" />
                // Разные скругления
                <Input radius="none" label="Без скругления" />
                <Input radius="sm" label="Маленькое скругление" />
                <Input radius="md" label="Среднее" />
                <Input radius="lg" label="Большое" />
                <Input radius="full" label="Круглое" />
                // Состояния
                <Input disabled label="Disabled" />
                <Input readOnly value="Только для чтения" />
                <Input isLoading label="Загрузка..." />
                <Input autoFocus label="Автофокус" />
                // С описанием
                <Input label="Пароль" type="password" description="Минимум 8 символов" />
                // Accessibility
                <Input
                    id="task-title-input"
                    label="Название задачи"
                    aria-label="Поле для ввода названия задачи"
                    aria-describedby="task-title-help"
                    aria-required="true"
                />
                <Text id="task-title-help" variant="tertiary" size="xs">
                    Введите краткое и понятное название
                </Text>
                // В форме
                <form>
                    <VStack gap="4" align="stretch">
                        <Input name="title" label="Название задачи" required />

                        <Input
                            name="description"
                            label="Описание"
                            placeholder="Необязательное поле"
                        />

                        <Button type="submit">Создать</Button>
                    </VStack>
                </form>
            </VStack>
            <VStack gap="8">
                <Button variant="filled" color="primary">
                    Сохранить // Filled (Primary) - основное действие
                </Button>
                <Button variant="outline" color="primary">
                    Редактировать // Outline - вторичное действие
                </Button>
                <Button variant="ghost" color="primary">
                    Подробнее // Ghost - третичное действие, минималистичный вид
                </Button>
                <Button variant="clear" color="primary">
                    Отмена // Clear - текстовая кнопка без визуальных границ
                </Button>
                <Button variant="filled" color="primary">
                    Отправить // Primary (синий) - основное действие
                </Button>
                <Button variant="filled" color="success">
                    Готово // Success (зеленый) - успешное действие
                </Button>
                <Button variant="filled" color="error">
                    Удалить // Error (красный) - опасное/деструктивное действие
                </Button>
                <Button variant="filled" color="warning">
                    Предупредить // Warning (оранжевый) - предупреждение
                </Button>
                <Button variant="filled" color="neutral">
                    Пропустить // Neutral (серый) - нейтральное действие
                </Button>
                <Button size="xs" variant="filled">
                    XS // Extra Small - для плотных интерфейсов
                </Button>
                <Button size="sm" variant="filled">
                    Small // Small - для таблиц, форм
                </Button>
                <Button size="md" variant="filled">
                    Medium // Medium - по умолчанию
                </Button>
                <Button size="lg" variant="filled">
                    Large // Large - для важных действий
                </Button>
                <Button size="xl" variant="filled">
                    Extra Large // Extra Large - для CTA на landing pages
                </Button>
                <Button radius="none">None // None - острые углы (редко используется)</Button>
                <Button radius="sm">Small // Small - минимальное скругление</Button>
                <Button radius="md">Medium // Medium - по умолчанию</Button>
                <Button radius="lg">Large // Large - заметное скругление</Button>
                <Button radius="xl">XL // XL - сильное скругление</Button>
                <Button radius="full">Full // Full - круглая кнопка</Button>
            </VStack>
            <VStack gap="4">
                // Базовое использование
                <Text title="Заголовок" text="Основной текст" />
                // С детьми вместо text
                <Text title="Задача">Купить молоко, хлеб и яйца. Не забыть про сыр.</Text>
                // Все цветовые варианты
                <Text variant="primary" text="Основной текст" />
                <Text variant="secondary" text="Вторичный текст" />
                <Text variant="tertiary" text="Третичный текст" />
                <Text variant="success" text="Успешное действие" />
                <Text variant="error" text="Ошибка" />
                <Text variant="warning" text="Предупреждение" />
                <Text variant="accent" text="Акцентный текст" />
                // Все размеры
                <Text size="xs" title="Очень маленький" />
                <Text size="sm" title="Маленький" />
                <Text size="md" title="Средний (по умолчанию)" />
                <Text size="lg" title="Большой" />
                <Text size="xl" title="Очень большой" />
                <Text size="2xl" title="Заголовок 2xl" />
                <Text size="3xl" title="Заголовок 3xl" />
                <Text size="4xl" title="Заголовок 4xl" />
                // Выравнивание
                <Text align="left" text="Слева" />
                <Text align="center" text="По центру" />
                <Text align="right" text="Справа" />
                <Text align="justify" text="По ширине" />
                // Вес шрифта
                <Text weight="light" text="Light" />
                <Text weight="normal" text="Normal" />
                <Text weight="medium" text="Medium" />
                <Text weight="semibold" text="Semibold" />
                <Text weight="bold" text="Bold" />
                <Text weight="black" text="Black" />
                // Дополнительные стили
                <Text italic text="Курсив" />
                <Text underline text="Подчеркнутый" />
                <Text strikethrough text="Зачеркнутый" />
                <Text truncate text="Очень длинный текст который будет обрезан" />
                <Text nowrap text="Текст без переноса" />
                // Разные семантические элементы
                <Text as="p">Параграф</Text>
                <Text as="span">Inline текст</Text>
                <Text as="label" htmlFor="input-id">
                    Метка для инпута
                </Text>
                <Text as="legend">Легенда для fieldset</Text>
                // Accessibility примеры
                <Text title="Уведомления" aria-live="polite" aria-atomic>
                    У вас 3 новых сообщения
                </Text>
                <Text id="description" aria-label="Описание задачи">
                    Подробное описание что нужно сделать
                </Text>
                // Для форм
                <Text as="label" htmlFor="email-input" variant="secondary" size="sm">
                    Email адрес
                </Text>
            </VStack>
            <VStack>
                // Базовые варианты
                <Card variant="elevated" padding="8" radius="md">
                    <Text title="Заголовок">Содержимое карточки</Text>
                </Card>
                <Card variant="outline" padding="12">
                    Карточка с outline
                </Card>
                <Card variant="filled" padding="16">
                    Заполненная карточка
                </Card>
                <Card variant="ghost" padding="8">
                    Прозрачная карточка
                </Card>
                // Разные скругления
                <Card radius="none">Без скругления</Card>
                <Card radius="sm">Маленькое скругление</Card>
                <Card radius="md">Среднее (по умолчанию)</Card>
                <Card radius="lg">Большое скругление</Card>
                <Card radius="xl">Очень большое</Card>
                <Card radius="full">Полное скругление</Card>
                // Разные отступы
                <Card padding="0">Без отступов</Card>
                <Card padding="4">Маленькие отступы</Card>
                <Card padding="8">Стандартные отступы</Card>
                <Card padding="12">Средние отступы</Card>
                <Card padding="16">Большие отступы</Card>
                <Card padding="24">Очень большие отступы</Card>
                // Layout
                <Card fullWidth>На всю ширину</Card>
                <Card fullWidth maxWidth="400px">
                    На всю ширину, но макс 400px
                </Card>
                // Accessibility
                <Card role="article" aria-label="Статья о React" aria-describedby="article-desc">
                    <Text id="article-desc" className="visually-hidden">
                        Подробная статья о React и TypeScript
                    </Text>
                    Содержимое статьи...
                </Card>
                <Card role="region" aria-label="Список задач" tabIndex={0}>
                    {/* Focusable карточка */}
                    asdasd
                </Card>
                // Комплексный пример
                <Card variant="elevated" padding="16" radius="lg" fullWidth className="todo-card">
                    <VStack gap="8" align="stretch">
                        <HStack justify="between" align="center">
                            <Text size="xl" title="Список задач" weight="semibold" />
                        </HStack>

                        <VStack gap="4" align="stretch">
                            <Text>✅ Купить продукты</Text>
                            <Text>📝 Написать код</Text>
                            <Text>🏃 Пробежка</Text>
                        </VStack>

                        <HStack justify="end" gap="4">
                            <Button variant="outline" size="sm">
                                Очистить
                            </Button>
                            <Button variant="filled" size="sm">
                                Сохранить
                            </Button>
                        </HStack>
                    </VStack>
                </Card>
            </VStack>
        </main>
    );
});
