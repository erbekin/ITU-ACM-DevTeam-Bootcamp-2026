import express from "express";
import {
  getTodosController,
  addTodoController,
  getTodoByIdController,
  deleteTodoController,
  replaceTodoController,
  updateTodoController,
} from "./todos.controller.js";
import { validateAddTodo, validateReplaceTodo, validateUpdateTodo, validateGetTodoQuery } from "./todos.validator.js";

const r = express.Router();

r.get("/", validateGetTodoQuery, getTodosController);

r.post("/", validateAddTodo, addTodoController);

r.get("/:id", getTodoByIdController);

r.put("/:id", validateReplaceTodo, replaceTodoController);
r.patch("/:id", validateUpdateTodo, updateTodoController);
r.delete("/:id", deleteTodoController)

export default r;
