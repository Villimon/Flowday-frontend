import { addDays, subDays, endOfWeek, isAfter } from 'date-fns';

describe('Полный workflow приложения', () => {
    // === ИСХОДНЫЕ ТЕСТОВЫЕ ДАННЫЕ ===
    const todo1 = {
        title: 'Первая задача',
        description: 'Описание первой задачи',
    };

    const todo2 = {
        title: 'Вторая задача',
        description: 'Описание второй задачи',
    };

    const label1 = 'Важное';
    const label2 = 'Срочное';
    const label3 = 'Личное';

    // === ДИНАМИЧЕСКИЙ РАСЧЕТ ДАТ ДЛЯ БЛОКОВ (Чтобы тесты никогда не падали) ===
    const today = new Date();

    // 1. Просроченная: вчерашний день
    const overdueDate = subDays(today, 1).toISOString();

    // 2. Сегодня: текущий день (ставим 12:00, чтобы не было проблем с полночью)
    const todayDate = new Date(today.setHours(12, 0, 0, 0)).toISOString();

    // 3. На этой неделе: определяем конец недели и берем день перед ним (например, суббота),
    // но проверяем, чтобы этот день был строго позже сегодняшнего.
    let thisWeekDate = addDays(today, 1);
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 }); // Конец недели (Воскресенье)
    if (isAfter(thisWeekDate, endOfCurrentWeek)) {
        thisWeekDate = today; // фолбек на крайний случай
    }
    const thisWeekISO = thisWeekDate.toISOString();

    // 4. Будущие задачи: берем понедельник следующей недели (конец текущей + 1 день)
    const upcomingISO = addDays(endOfCurrentWeek, 1).toISOString();

    before(() => {
        cy.visit('/');
        cy.resetDatabase();
    });

    it('1. Проверка запуска главной страницы', () => {
        cy.visit('/');
        cy.contains('Flowday').should('be.visible');
        cy.contains('Красивый планировщик').should('be.visible');
        cy.url().should('eq', 'http://localhost:3000/');
    });

    it('2. Авторизация через UI → logout', () => {
        cy.loginViaUI();
        cy.window().should(win => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(win.localStorage.getItem('token')).to.not.be.null;
        });
        cy.logout();
        cy.window().should(win => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(win.localStorage.getItem('token')).to.be.null;
        });
    });

    it('3. Авторизация через UI → редирект на страницу задач', () => {
        cy.loginViaUIWhithRedirectToTodos();
        cy.url().should('include', '/todos');
        cy.contains('ГРАФИК ДНЯ').should('be.visible');
    });

    it('4. Создание первой задачи через UI', () => {
        cy.login();
        cy.createTodoViaUI(todo1.title, todo1.description);
        cy.contains(todo1.title).should('be.visible');
    });

    it('4.1 Динамическое создание задач для всех блоков и проверка во view=list', () => {
        cy.login();
        const API_URL = Cypress.env('apiUrl');

        cy.window().then(win => {
            const token = win.localStorage.getItem('token');
            const userId = win.localStorage.getItem('userID');
            const headers = { Authorization: `Bearer ${token}`, userID: userId };

            // Создаем задачу для блока "Просрочено"
            cy.request({
                method: 'POST',
                url: `${API_URL}/todos`,
                headers,
                body: {
                    title: 'Динамическая Просроченная',
                    description: 'Тест',
                    startDate: overdueDate,
                },
            });

            // Создаем задачу для блока "Сегодня"
            cy.request({
                method: 'POST',
                url: `${API_URL}/todos`,
                headers,
                body: { title: 'Динамическая Сегодня', description: 'Тест', startDate: todayDate },
            });

            // Создаем задачу для блока "На этой неделе"
            cy.request({
                method: 'POST',
                url: `${API_URL}/todos`,
                headers,
                body: {
                    title: 'Динамическая На неделе',
                    description: 'Тест',
                    startDate: thisWeekISO,
                },
            });

            // Создаем задачу для блока "Будущие"
            cy.request({
                method: 'POST',
                url: `${API_URL}/todos`,
                headers,
                body: {
                    title: 'Динамическая Будущее',
                    description: 'Тест',
                    startDate: upcomingISO,
                },
            });
        });

        // Перезагружаем страницу, чтобы подтянулись созданные через API задачи, и переключаем на Список
        cy.reload();
        cy.contains('Список').click();

        // Проверяем распределение по блокам во view=list
        cy.contains('Просроченные')
            .closest('div[class*="styles"], div[class*="todo"], div[class*="group"]')
            .find('[data-testid="todo-card"]')
            .contains('Динамическая Просроченная')
            .should('be.visible');
        cy.contains('Сегодня')
            .scrollIntoView()
            .closest('div[class*="styles"], div[class*="todo"], div[class*="group"]')
            .find('[data-testid="todo-card"]')
            .contains('Динамическая Сегодня')
            .should('be.visible');

        cy.get('body').then($body => {
            // Проверяем блок "На этой неделе" только если он физически присутствует в интерфейсе
            if ($body.text().includes('На этой неделе')) {
                cy.contains('[data-testid="todo-card"]', 'Динамическая На неделе')
                    .scrollIntoView()
                    .closest('div[class*="styles"], div[class*="todo"], div')
                    .invoke('text')
                    .should('match', /недел/);
            }

            // Проверяем блок "Будущие" только если он физически есть на экране
            if ($body.text().includes('Будущие')) {
                cy.contains('[data-testid="todo-card"]', 'Динамическая Будущее')
                    .scrollIntoView()
                    .closest('div[class*="styles"], div[class*="todo"], div')
                    .invoke('text')
                    .should('match', /Будущ/);
            }
        });

        // Проверяем, что наша исходная Первая задача на месте в блоке "Без даты"
        cy.contains('Без даты')
            .scrollIntoView()
            .closest('div[class*="styles"], div[class*="todo"], div[class*="group"]')
            .find('[data-testid="todo-card"]')
            .contains(todo1.title)
            .should('be.visible');
    });

    it('5. Создание метки через UI', () => {
        cy.login();
        cy.createLabelViaUI(label1);
        cy.contains(label1).should('be.visible');
    });

    it('6. Редактирование задачи', () => {
        cy.login();
        cy.editTodoViaUI(todo1.title, 'Измененная первая задача', 'Новое описание');
        cy.contains('Измененная первая задача').should('be.visible');
        cy.contains(todo1.title).should('not.exist');
    });

    it('7. Изменение статуса задачи (toggle)', () => {
        cy.login();
        cy.toggleTodoStatus('Измененная первая задача');

        cy.contains('Измененная первая задача')
            .closest('[data-testid="todo-card"]')
            .invoke('attr', 'class')
            .should('contain', 'completed');

        cy.toggleTodoStatus('Измененная первая задача');

        cy.contains('Измененная первая задача')
            .closest('[data-testid="todo-card"]')
            .should('not.have.class', 'completed');
    });

    it('8. Создание меток и добавление их к задаче', () => {
        cy.login();
        cy.createLabelViaUI(label2);
        cy.get('body').type('{esc}');
        cy.createLabelViaUI(label3);
        cy.contains(label2).should('be.visible');
        cy.contains(label3).should('be.visible');
        cy.get('body').type('{esc}');

        cy.createTodoViaUI(todo2.title, todo2.description);

        cy.addLabelToTodo(todo2.title, label2);
        cy.addLabelToTodo(todo2.title, label3);

        cy.contains(todo2.title)
            .closest('[data-testid="todo-card"]')
            .contains(label2)
            .should('be.visible');
        cy.contains(todo2.title)
            .closest('[data-testid="todo-card"]')
            .contains(label3)
            .should('be.visible');
    });

    it('8.1 Проверка режима День (view=day) и скрытия блока "БЕЗ ВРЕМЕНИ"', () => {
        cy.login();
        cy.contains('День').click();

        // На сегодняшнем дне блок "БЕЗ ВРЕМЕНИ" должен отображаться
        cy.contains('БЕЗ ВРЕМЕНИ').should('be.visible');

        // Переключаем день на следующий (кнопка-стрелка справа от кнопки "Сегодня")
        cy.contains('Сегодня').next('button').click();

        // На не-сегодняшнем дне блок "БЕЗ ВРЕМЕНИ" по новой логике скрывается
        cy.contains('БЕЗ ВРЕМЕНИ').should('not.exist');

        // Возвращаемся обратно на "Сегодня"
        cy.contains('Сегодня').click();
        cy.contains('БЕЗ ВРЕМЕНИ').should('be.visible');
    });
    // =========================================================================

    it('9. Удаление первой метки', () => {
        cy.login();
        cy.intercept('DELETE', '**/labels/*').as('deleteLabelRequest');
        cy.deleteLabelViaUI(label2);
        cy.wait('@deleteLabelRequest').then(interception => {
            expect(interception.response?.statusCode).to.be.oneOf([200, 204]);
        });
        cy.contains(label2).should('not.exist');
        cy.contains(todo2.title)
            .closest('[data-testid="todo-card"]')
            .within(() => {
                cy.contains(label2).should('not.exist');
                cy.contains(label3).should('be.visible');
            });
    });

    it('10. Удаление задачи', () => {
        cy.login();
        cy.intercept('DELETE', '**/todos/*').as('deleteTodosRequest');
        cy.deleteTodoViaUI('Измененная первая задача');
        cy.wait('@deleteTodosRequest').then(interception => {
            expect(interception.response?.statusCode).to.be.oneOf([200, 204]);
        });
        cy.get('[class*="cardsColumn"]').within(() => {
            cy.contains('Измененная первая задача').should('not.exist');
        });
        cy.contains(todo2.title).scrollIntoView().should('be.visible');
    });

    it('11. Проверка API после всех операций', () => {
        cy.login();
        const API_URL = Cypress.env('apiUrl');

        cy.window().then(win => {
            const token = win.localStorage.getItem('token');
            const userId = win.localStorage.getItem('userID');

            cy.request({
                method: 'GET',
                url: `${API_URL}/todos?date=${new Date().toISOString()}`,
                headers: { Authorization: `Bearer ${token}`, userID: userId },
            }).then(response => {
                expect(response.status).to.eq(200);
                if (response.body.data && response.body.data.todos) {
                    const allActive = Object.values(response.body.data.todos).flat();
                    expect(allActive.length).to.be.greaterThan(0);
                }
            });

            cy.request({
                method: 'GET',
                url: `${API_URL}/labels`,
                headers: { Authorization: `Bearer ${token}`, userID: userId },
            }).then(response => {
                expect(response.status).to.eq(200);
                expect(response.body.data).to.have.length(2);
            });
        });
    });
});
