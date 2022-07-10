import { Lifecycle, scoped } from "tsyringe";
import { Database } from "../common/database";
import NotFoundError from "../common/errors/notFoundError";
import { Todo } from "./todo";

export type CreateTodoParameters = Pick<Todo, "description" | "done" | "title">;

@scoped(Lifecycle.ContainerScoped)
export class TodoService {
  constructor(private readonly database: Database) {}

  public async getTodos(): Promise<Todo[]> {
    const todos = await this.database.sql<Todo[]>`
        select 
            id,
            title,
            description,
            done
        from todos;
    `;

    return todos;
  }

  public async createTodo(parameters: CreateTodoParameters) {
    const [createdTodo] = await this.database.sql<Todo[]>`
        insert into todos ${this.database.sql(parameters)}
        returning id, title, description, done
    `;
  }

  public async updateTodo(todoId: number, todo: Todo) {
    const result = await this.database.sql`
        update todos set ${this.database.sql(
          todo,
          "title",
          "description",
          "done"
        )} where id = ${todoId} returning 1 as updated
    `;

    if (result.length === 0) {
      throw new NotFoundError(`No todo found with id ${todoId}`);
    }
  }
}
