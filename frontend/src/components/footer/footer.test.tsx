import { countTodosLeft, Footer } from "./index";
import { screen, render } from "../../test-lib/test-utils";
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
