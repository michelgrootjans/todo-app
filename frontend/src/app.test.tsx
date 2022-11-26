import {render, screen, waitFor} from "./test-lib/test-utils";
import App from "./app";
import {faker} from "@faker-js/faker";
import {mswServer, resetTodos} from "./test-lib/test-server";
import {aTodo} from "./test-lib/todo";
import {within} from "@testing-library/react";
import {AddTodoForm} from "./components/add-todo";
import {rest} from "msw";

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

        await waitFor(() => screen.getByText(/add some todos/i));
    });
});

test("given the user adds a todo, when the server returns an error, then the error message shows up", async () => {
    mswServer.use(
        rest.post('/api/todos', (req, res, ctx) => {
            return res(ctx.status(500), ctx.json({
                "code": "description_too_long",
                "errorMessage": "Description may not be more than 100 characters"
            }));
        })
    );

    const {user} = render(<AddTodoForm/>);
    const textBox = screen.getByRole('textbox', {name: /description/i});
    await user.type(textBox, "something{Enter}")
    await waitFor(() => {
        screen.getByText('Description may not be more than 100 characters');
        expect(textBox).toHaveValue('something')
    });
});

test("when the user adds a todo, a POST call is done to /api/todos with {\"description\":\"...\"} in the body.", async () => {
    const postCall = jest.fn();
    mswServer.use(
        rest.post('/api/todos', async req => postCall(await req.json()))
    );

    const {user} = render(<AddTodoForm/>);
    const textBox = screen.getByRole('textbox', {name: /description/i});
    await user.type(textBox, "something{Enter}")
    await waitFor(() => {
        expect(postCall).toHaveBeenCalledWith({description: 'something'})
    });
});

