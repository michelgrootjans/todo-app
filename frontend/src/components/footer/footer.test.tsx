import {countTodosLeft, Footer} from "./index";
import {render, screen} from "../../test-lib/test-utils";
import {aTodo} from "../../test-lib/todo";

it("empty array", () => {
    expect(countTodosLeft([])).toEqual(0);
});

it("not done", () => {
    expect(countTodosLeft([
        aTodo({done: false}),
    ])).toEqual(1);
});

it("all done", () => {
    expect(countTodosLeft([
        aTodo({done: true}),
        aTodo({done: true}),
        aTodo({done: true}),
    ])).toEqual(0);
});

test("all done", () => {
    render(<Footer todos={[aTodo({done: true})]}/>);
    screen.getByText(/all done/i);
});

test("1 todo left", () => {
    render(<Footer todos={[aTodo({done: false})]}/>);
    screen.getByText(/1 todo left/i);
});

test("4 todos left", () => {
    render(<Footer todos={[
        aTodo({done: false}),
        aTodo({done: false}),
        aTodo({done: true}),
        aTodo({done: false}),
        aTodo({done: false}),
    ]}/>);
    screen.getByText(/4 todos left/i);
});
