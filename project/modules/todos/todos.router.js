import express from "express";
import {
  getTodosController,
  addTodoController,
  getTodoByIdController,
  deleteTodoController,
  replaceTodoController,
  updateTodoController,
  addTagController,
  getTagsController,
  deleteTagController,
} from "./todos.controller.js";
import {
  validateAddTodo,
  validateAddTag,
  validateReplaceTodo,
  validateUpdateTodo,
  validateGetTodoQuery,
} from "./todos.validator.js";

const r = express.Router();

r.get("/", validateGetTodoQuery, getTodosController);

r.post("/", validateAddTodo, addTodoController);

r.get("/:id", getTodoByIdController);

r.put("/:id", validateReplaceTodo, replaceTodoController);
r.patch("/:id", validateUpdateTodo, updateTodoController);
r.delete("/:id", deleteTodoController);

r.get("/:id/tags", getTagsController);
r.post("/:id/tags", validateAddTag, addTagController);
r.delete("/:id/tags/:tagId", deleteTagController);
export default r;
