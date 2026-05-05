describe('Полный workflow приложения', () => {
    // Тестовые данные
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
        cy.contains('Список задач пустой').should('be.visible');
    });

    it('4. Создание задачи через UI', () => {
        cy.login();
        cy.createTodoViaUI(todo1.title, todo1.description);
        cy.contains(todo1.title).should('be.visible');
    });

    it('5. Создание метки через UI', () => {
        cy.login();
        cy.createLabelViaUI(label1);
        cy.contains(label1).should('be.visible');
    });

    it('6. Редактирование задачи', () => {
        cy.login();

        const editedTitle = 'Измененная первая задача';
        const editedDescription = 'Измененное описание';

        cy.editTodoViaUI(todo1.title, editedTitle, editedDescription);
        cy.contains(editedTitle).should('be.visible');
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

    it('8-9. Создание еще одной задачи и двух меток', () => {
        cy.login();

        cy.createTodoViaUI(todo2.title, todo2.description);
        cy.contains(todo2.title).should('be.visible');

        cy.createLabelViaUI(label2);
        cy.get('body').type('{esc}');
        cy.createLabelViaUI(label3);

        cy.contains(label2).should('be.visible');
        cy.contains(label3).should('be.visible');
    });

    it('10. Добавление двух меток ко второй задаче', () => {
        cy.login();

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

    it('11. Удаление первой метки', () => {
        cy.login();
        cy.deleteLabelViaUI(label2);
        cy.contains(label2).should('not.exist');
        cy.wait(500);
        cy.contains(todo2.title)
            .closest('[data-testid="todo-card"]')
            .within(() => {
                cy.contains(label2).should('not.exist');
                cy.contains(label3).should('be.visible');
            });
    });

    it('12-13. Удаление первой задачи и проверка количества', () => {
        cy.login();

        cy.deleteTodoViaUI('Измененная первая задача');
        cy.wait(1000);
        cy.contains('Измененная первая задача').should('not.exist');

        cy.contains(todo2.title).should('be.visible');
        cy.get('[data-testid="todo-card"]').should('have.length', 1);
    });

    it('14. Проверка API после всех операций', () => {
        cy.login();

        const API_URL = Cypress.env('apiUrl');

        cy.window().then(win => {
            const token = win.localStorage.getItem('token');
            const userId = win.localStorage.getItem('userID');

            cy.request({
                method: 'GET',
                url: `${API_URL}/todos`,
                headers: { Authorization: `Bearer ${token}`, userID: userId },
            }).then(response => {
                expect(response.status).to.eq(200);
                expect(response.body.data).to.have.length(1);
                expect(response.body.data[0].title).to.eq(todo2.title);
            });

            cy.request({
                method: 'GET',
                url: `${API_URL}/labels`,
                headers: { Authorization: `Bearer ${token}`, userID: userId },
            }).then(response => {
                expect(response.status).to.eq(200);
                expect(response.body.data).to.have.length(2);
                const labels = response.body.data.map((l: any) => l.name);
                expect(labels).to.include.members([label1, label3]);
            });
        });
    });
});
