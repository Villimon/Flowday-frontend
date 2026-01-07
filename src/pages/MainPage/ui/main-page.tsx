import { Button } from '@/shared/ui/Buttons/buttons';
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
            <br />
            <Button variant="filled" color="primary">
                Сохранить // Filled (Primary) - основное действие
            </Button>
            <br />
            <Button variant="outline" color="primary">
                Редактировать // Outline - вторичное действие
            </Button>
            <br />
            <Button variant="ghost" color="primary">
                Подробнее // Ghost - третичное действие, минималистичный вид
            </Button>
            <br />
            <Button variant="clear" color="primary">
                Отмена // Clear - текстовая кнопка без визуальных границ
            </Button>
            <br />
            <Button variant="filled" color="primary">
                Отправить // Primary (синий) - основное действие
            </Button>
            <br />
            <Button variant="filled" color="success">
                Готово // Success (зеленый) - успешное действие
            </Button>
            <br />
            <Button variant="filled" color="error">
                Удалить // Error (красный) - опасное/деструктивное действие
            </Button>
            <br />
            <Button variant="filled" color="warning">
                Предупредить // Warning (оранжевый) - предупреждение
            </Button>
            <br />
            <Button variant="filled" color="neutral">
                Пропустить // Neutral (серый) - нейтральное действие
            </Button>
            <br />
            <Button size="xs" variant="filled">
                XS // Extra Small - для плотных интерфейсов
            </Button>
            <br />
            <Button size="sm" variant="filled">
                Small // Small - для таблиц, форм
            </Button>
            <br />
            <Button size="md" variant="filled">
                Medium // Medium - по умолчанию
            </Button>
            <br />
            <Button size="lg" variant="filled">
                Large // Large - для важных действий
            </Button>
            <br />
            <Button size="xl" variant="filled">
                Extra Large // Extra Large - для CTA на landing pages
            </Button>
            <br />

            <Button radius="none">None // None - острые углы (редко используется)</Button>
            <br />

            <Button radius="sm">Small // Small - минимальное скругление</Button>
            <br />

            <Button radius="md">Medium // Medium - по умолчанию</Button>
            <br />

            <Button radius="lg">Large // Large - заметное скругление</Button>
            <br />

            <Button radius="xl">XL // XL - сильное скругление</Button>
            <br />

            <Button radius="full">Full // Full - круглая кнопка</Button>
            <br />
        </main>
    );
});
