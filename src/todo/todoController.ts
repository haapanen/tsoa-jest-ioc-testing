import { Body, Controller, Get, Path, Post, Put, Route, SuccessResponse } from "tsoa";
import { singleton } from "tsyringe";
import { Todo } from "./todo";
import { CreateTodoParameters, TodoService } from "./todoService";

@singleton()
@Route("api/v1/todos")
export class TodoController extends Controller {
  constructor(private readonly todoService: TodoService) {
    super();
  }

  @Get("")
  public async getTodos(): Promise<Todo[]> {
    return await this.todoService.getTodos();
  }

  @Post("")
  @SuccessResponse("201", "Created")
  public async createTodo(@Body() parameters: CreateTodoParameters): Promise<void> {
    this.setStatus(201);
    await this.todoService.createTodo(parameters);
  }

  @Put("{todoId}")
  @SuccessResponse("204", "Updated")
  public async updateTodo(@Path() todoId: number, @Body() todo: Todo): Promise<void> {
    this.setStatus(204);
    await this.todoService.updateTodo(todoId, todo);
  }
}
