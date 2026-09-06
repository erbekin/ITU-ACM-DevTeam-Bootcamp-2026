import express from "express";
import {
  getTodosController,
  addTodoController,
  getTodoByIdController,
  deleteTodoController,
  replaceTodoController,
  updateTodoController,
} from "./todos.controller.js";
import { validateAddTodo, validateReplaceTodo, validateUpdateTodo } from "./todos.validator.js";

const r = express.Router();

r.get("/", getTodosController);

r.post("/", validateAddTodo, addTodoController);

r.get("/:id", getTodoByIdController);

// TODO (Aşama 1): PUT /:id, PATCH /:id ve DELETE /:id route'larını ekleyin.
// Güncelleme route'larının önüne uygun validator'ları zincirlemeyi unutmayın.
r.put("/:id", validateReplaceTodo, replaceTodoController);
r.patch("/:id", validateUpdateTodo, updateTodoController);
r.delete("/:id", deleteTodoController)
export default r;
