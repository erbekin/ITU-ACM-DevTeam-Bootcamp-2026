import { getTodos, addTodo, getTodoById, replaceTodo, updateTodo, deleteTodo } from "./todos.service.js";
import { TodoNotFound } from "./todos.errors.js";
import StorageKeys from "./todos.storage-keys.js";
import { getUserById } from "../users/users.service.js";
import { deleteTagOfTodo, tagTodo, tagsOfTodo } from "../tags/tags.service.js";
import Fun from "../../utils/fun.js";
import { ConflictError, NotFoundError } from "../errors.js";

export const getTodosController = async (req, res) => {
  const { completed, q } = req.storage.get(StorageKeys.GET_TODO_QUERY_PACKET);
  res.header("X-Query", `completed:${typeof completed}, q:${typeof q}`);
  res.json(await getTodos({ completed, q }));
};

export const addTodoController = async (req, res) => {
  const { title, description, userId, priority } = req.body;
  if (Fun.isSome(userId) && Fun.isNil(await getUserById(userId))) {
    res.status(400).json({
      error: "User not found",
      userId,
    });
    return;
  }
  const todo = await addTodo({ title, description, userId, priority });
  res.status(201).json(todo);
};

export const getTodoByIdController = async (req, res) => {
  const { id } = req.params;
  const todo = await getTodoById(id);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }
  res.status(200).json(todo);
};

// TODO (Aşama 1): replaceTodoController, updateTodoController ve
// deleteTodoController fonksiyonlarını ekleyin.
//
// Hatırlatma: controller HTTP'yi bilir — req'ten okur, status kodunu seçer,
// yanıtı yazar. İş kuralları service katmanında kalmalı.

export const replaceTodoController = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  let todo = null;
  try {
    todo = await replaceTodo(id, { title, description, completed });
  } catch (err) {
    if (err instanceof TodoNotFound) {
      return res.status(404).json({ error: err.message });
    }
    throw err;
  }
  res.json(todo);
};

export const updateTodoController = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed, priority } = req.storage.get(StorageKeys.UPDATE_TODO_PACKET);
  let todo = null;
  try {
    todo = await updateTodo(id, { title, description, completed, priority });
  } catch (err) {
    if (err instanceof TodoNotFound) {
      return res.status(404).json({ err: err.message });
    }
    throw err;
  }
  res.json(todo);
};

export const deleteTodoController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteTodo(id);
  } catch (err) {
    if (err instanceof TodoNotFound) {
      return res.status(404).json({ err: err.message });
    }
    throw err;
  }
  res.status(204).send();
};

export const addTagController = async (req, res) => {
  const { id } = req.params;
  const { tagId } = req.body;
  try {
    const result = await tagTodo(id, tagId);
    res.status(201).json(result);
  } catch (e) {
    if (e instanceof ConflictError) {
      res.status(409).json({ error: e.message, detail: e.detail });
      return;
    }
    if (e instanceof NotFoundError) {
      res.status(404).json({ error: e.message, detail: e.detail });
      return;
    }
    throw e;
  }
};

export const getTagsController = async (req, res) => {
  const { id } = req.params;
  if (Fun.isNil(await getTodoById(id))) {
    res.status(400).json({ error: "todo not found" });
    return;
  }
  const tags = await tagsOfTodo(id);
  res.json(tags);
};

export const deleteTagController = async (req, res) => {
  const { id, tagId } = req.params;
  try {
    const result = await deleteTagOfTodo(id, tagId);
    res.status(204).json(result);
    return;
  } catch (e) {
    if (e instanceof NotFoundError) {
      res.status(404).json({ error: e.message, detail: e.detail });
      return;
    }
    throw e;
  }
};
