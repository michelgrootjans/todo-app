import {AddTodoForm, isValid} from "./index";
import {render, screen, waitFor} from "../../test-lib/test-utils";

test("empty string is not valid", () => {
    expect(isValid('')).toBeFalsy();
});

test("whitespace is not valid", () => {
    expect(isValid('     ')).toBeFalsy();
});

test("text is valid", () => {
    expect(isValid('text')).toBeTruthy();
});

test("user types something in 'Description', presses enter: description should become empty", async () => {
    const {user} = render(<AddTodoForm/>);
    const textBox = screen.getByRole('textbox', {name: /description/i});
    await user.type(textBox, "something{Enter}")
    await waitFor(() => expect(textBox).toHaveValue(''));
});

test("user types something in 'Description', clicks the add button: description should become empty", async () => {
    const {user} = render(<AddTodoForm/>);
    const textBox = screen.getByRole('textbox', {name: /description/i});
    const addButton = screen.getByRole('button', {name: /add/i});

    await user.type(textBox, "something");
    await user.click(addButton);
    await waitFor(() => expect(textBox).toHaveValue(''));
});
