import { singleton } from "tsyringe";
import NotFoundError from "../common/errors/notFoundError";
import { Todo } from "./todo";

export type CreateTodoParameters = Pick<Todo, "description" | "done" | "title">;

@singleton()
export class TodoService {
  private nextFreeId = 1;
  private todos: Todo[] = [];

  public getTodos(): Todo[] {
    return this.todos;
  }

  public createTodo(parameters: CreateTodoParameters) {
    this.todos.push({
      ...parameters,
      id: this.nextFreeId++,
    });
  }

  public updateTodo(todoId: number, todo: Todo) {
    const todoIdx = this.todos.findIndex((t) => t.id === todoId);
    if (todoIdx < 0) {
      throw new NotFoundError();
    }
    this.todos[todoIdx] = todo;
  }
}
