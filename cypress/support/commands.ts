const API_URL = Cypress.env('apiUrl');

Cypress.Commands.add('resetDatabase', () => {
    cy.window().then(() => {
        cy.request({
            method: 'POST',
            url: `${API_URL}/test/reset`,
            headers: {
                userID: 1777897578807,
            },
            failOnStatusCode: false,
        }).then(response => {
            cy.log(`Database reset: ${response.status}`);
        });
    });
});

Cypress.Commands.add('login', () => {
    const email = Cypress.env('testUserEmail');
    const password = Cypress.env('testUserPassword');

    cy.request('POST', `${API_URL}/auth/login`, {
        email,
        password,
    }).then(response => {
        expect(response.status).to.eq(201);
        const token = response.body.data.token;
        const userId = response.body.data.id;
        cy.window().then(win => {
            win.localStorage.setItem('token', token);
            win.localStorage.setItem('userID', userId);
        });
        cy.visit('/todos');
    });
});

Cypress.Commands.add('loginViaUI', () => {
    const email = Cypress.env('testUserEmail');
    const password = Cypress.env('testUserPassword');

    cy.visit('/');
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="submit-login-button"]').click();
    cy.url().should('include', '/');
});

Cypress.Commands.add('loginViaUIWhithRedirectToTodos', () => {
    const email = Cypress.env('testUserEmail');
    const password = Cypress.env('testUserPassword');

    cy.visit('/');
    cy.get('[data-testid="login-button-redirect"]').first().click();
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="submit-login-button"]').click();
    cy.url().should('include', '/todos');
});

Cypress.Commands.add('logout', () => {
    cy.get('[data-testid="menu"]').click();
    cy.get('[data-testid="logout-button"]').click();
    cy.url().should('eq', 'http://localhost:3000/');
    cy.window().should(win => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(win.localStorage.getItem('token')).to.be.null;
    });
});

// Работа с задачами
Cypress.Commands.add(
    'createTodoViaUI',
    (title: string, description?: string, labels?: string[]) => {
        cy.get('[data-testid="create-todo-button"]').click();
        cy.get('[data-testid="todo-title-input"]').type(title);
        if (description) {
            cy.get('[data-testid="todo-description-input"]').type(description);
        }
        if (labels && labels.length > 0) {
            cy.get('[data-testid="label-select"]').click();
            labels.forEach(label => {
                cy.get(`[data-testid="label-option-${label}"]`).click();
            });
        }
        cy.get('[data-testid="submit-todo-button"]').click();
        cy.contains(title).should('be.visible');
    }
);

Cypress.Commands.add('deleteTodoViaUI', (title: string) => {
    cy.contains(title)
        .closest('[data-testid="todo-card"]')
        .realHover()
        .within(() => {
            cy.get('[data-testid="delete-todo-button"]').should('be.visible').click();
        });
    cy.contains(title).should('not.exist');
});

Cypress.Commands.add('toggleTodoStatus', (title: string) => {
    cy.contains('[data-testid="todo-card"]', title).click();
});

Cypress.Commands.add(
    'editTodoViaUI',
    (oldTitle: string, newTitle: string, newDescription?: string) => {
        cy.contains(oldTitle)
            .closest('[data-testid="todo-card"]')
            .realHover()
            .within(() => {
                cy.get('[data-testid="edit-todo-button"]').should('be.visible').click();
            });
        cy.get('[data-testid="todo-title-input"]').clear().type(newTitle);
        if (newDescription) {
            cy.get('[data-testid="todo-description-input"]').clear().type(newDescription);
        }
        cy.get('[data-testid="submit-todo-button"]').click();
        cy.contains(newTitle).should('be.visible');
    }
);

// Работа с метками
Cypress.Commands.add('createLabelViaUI', (name: string) => {
    cy.get('[data-testid="create-todo-button"]').click();
    cy.get('[data-testid="create-label-button"]').click();
    cy.get('[data-testid="label-name-input"]').type(name);
    cy.get('[data-testid="submit-label-button"]').click();
    cy.contains(name).should('be.visible');
});

Cypress.Commands.add('deleteLabelViaUI', (name: string) => {
    cy.get('[data-testid="create-todo-button"]').click();
    cy.contains(`[data-testid="label-option-${name}"]`, name)
        .find(`[data-testid="remove-button-${name}"]`)
        .click();
});

Cypress.Commands.add('addLabelToTodo', (todoTitle: string, labelName: string) => {
    cy.contains(todoTitle)
        .closest('[data-testid="todo-card"]')
        .realHover()
        .within(() => {
            cy.get('[data-testid="edit-todo-button"]').should('be.visible').click();
        });
    cy.get(`[data-testid="label-option-${labelName}"]`).click();
    cy.get('[data-testid="submit-todo-button"]').click();
    cy.contains(todoTitle)
        .closest('[data-testid="todo-card"]')
        .contains(labelName)
        .should('be.visible');
});

Cypress.Commands.add('getByTestId', (testId: string) => {
    return cy.get(`[data-testid="${testId}"]`);
});
