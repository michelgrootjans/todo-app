import {TodoTO} from "../lib/api";
import {faker} from "@faker-js/faker";

export function aTodo(overrides: Partial<TodoTO> = {}) {
    return {id: faker.datatype.uuid(), description: faker.lorem.text(), done: faker.datatype.boolean(), ...overrides};
}

