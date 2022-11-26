import {render, screen, waitFor} from "./test-lib/test-utils";
import App from "./app";
import {faker} from "@faker-js/faker";
import {resetTodos} from "./test-lib/test-server";
import {aTodo} from "./test-lib/todo";
import {within} from "@testing-library/react";

test("renders title", async () => {
    render(<App/>);
    const title = screen.getByRole("heading", {name: /Todo/i});
    expect(title).toBeInTheDocument();
});

test('user types something in the description and clicks add. The todo shows up in the list.', async () => {
    const {user} = render(<App/>);
    const textBox = screen.getByRole('textbox', {name: /description/i});
    const addButton = screen.getByRole('button', {name: /add/i});

    let description = faker.lorem.word();
    await user.type(textBox, description);
    await user.click(addButton);
    await waitFor(() => {
        screen.getByRole('checkbox', {name: description})
    });
});

test("start off with a single todo item in the list. When the user marks it as done, the footer should show 'All done!'", async () => {
    resetTodos([aTodo({description: 'todo name', done: false})])
    const {user} = render(<App/>);

    await waitFor(async () => {
        const checkbox = screen.getByRole('checkbox', {name: 'todo name'});
        await user.click(checkbox);
        screen.getByText(/all done/i);
    });

});

test("start off with a single todo item in the list. When the user deletes it, the text 'Add some todos' should show up.", async () => {
    resetTodos([aTodo({description: 'todo name', done: false})])
    const {user} = render(<App/>);

    await waitFor(async () => {
        const list = screen.getByRole('list')
        const removeButton = within(list).getByRole('button', {name: /remove/i});
        await user.click(removeButton);

        await waitFor(() => {
            screen.getByText(/add some todos/i);
        });
    });
});
