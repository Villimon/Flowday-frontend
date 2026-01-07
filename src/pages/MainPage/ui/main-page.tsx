import { Button } from '@/shared/ui';
import { HStack, VStack } from '@/shared/ui/Stack';
import { Text } from '@/shared/ui/Text';
import { memo } from 'react';

export const MainPage = memo(() => {
    const auth = false;
    return (
        <main>
            <p>Информация о сайте</p>
            {auth ? (
                <button>Перейти к работе с задачи</button>
            ) : (
                <button>Войти, чтобы начать работу</button>
            )}
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
        </main>
    );
});
