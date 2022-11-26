import { isValid } from "./index";
import { screen, render, waitFor } from "../../test-lib/test-utils";

test("empty string is not valid", () => {
    expect(isValid('')).toBeFalsy();
});

test("whitespace is not valid", () => {
    expect(isValid('     ')).toBeFalsy();
});

test("text is valid", () => {
    expect(isValid('text')).toBeTruthy();
});
