/* eslint-disable @typescript-eslint/no-namespace */
import 'cypress-real-events';
import './commands';

declare global {
    namespace Cypress {
        interface Chainable {
            resetDatabase(): Chainable<void>;
            login(): Chainable<void>;
            loginViaUI(): Chainable<void>;
            loginViaUIWhithRedirectToTodos(): Chainable<void>;
            logout(): Chainable<void>;
            deleteTodoViaUI(title: string): Chainable<void>;
            toggleTodoStatus(title: string): Chainable<void>;
            editTodoViaUI(
                oldTitle: string,
                newTitle: string,
                newDescription?: string
            ): Chainable<void>;
            createTodoViaUI(
                title: string,
                description?: string,
                labels?: string[]
            ): Chainable<void>;
            createLabelViaUI(name: string): Chainable<void>;
            deleteLabelViaUI(name: string): Chainable<void>;
            addLabelToTodo(todoTitle: string, labelName: string): Chainable<void>;
            getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
        }
    }
}
