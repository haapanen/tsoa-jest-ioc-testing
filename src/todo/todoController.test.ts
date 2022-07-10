import "reflect-metadata";
import { Database } from "../common/database";
import { iocContainer } from "../ioc";
import { Todo } from "./todo";
import { TodoController } from "./todoController";

const removeTodos = async () => {
  const database = iocContainer.get(Database);

  await database.sql`delete from todos;`;
};

beforeEach(async () => {
  await removeTodos();
});

describe("Todos API", () => {
  it("Should create a todo", async () => {
    const todosController = iocContainer.get(TodoController);
    const database = iocContainer.get(Database);

    await todosController.createTodo({
      title: "title",
      description: "description",
      done: false,
    });

    const result = await database.sql<Todo[]>`select * from todos;`;

    expect(result[0]).toMatchSnapshot({
      id: expect.any(Number),
    });
  });
});
