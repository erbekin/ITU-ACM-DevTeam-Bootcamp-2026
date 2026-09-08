import { getTodos, addTodo, getTodoById, replaceTodo, updateTodo, deleteTodo } from "./todos.service.js";
import { TodoNotFound } from "./todos.errors.js"
import StorageKeys from "./todos.storage-keys.js"
import { getUserById } from "../users/users.service.js";
import Fun from "../../utils/fun.js";


export const getTodosController = async (req, res) => {
  const { completed, q } = req.query;
  res.json(await getTodos({ completed, q }));
};

export const addTodoController = async (req, res) => {
  const { title, description, userId } = req.body;
  if (Fun.isSome(userId) && Fun.isNil(await getUserById(userId))) {
    res.status(400).json({
      error: "User not found",
      userId,
    })
    return;
  }
  const todo = await addTodo(title, description, userId);
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
  let todo = null
  try {
    todo = await replaceTodo(id, { title, description, completed });
  } catch (err) {
    if (err instanceof TodoNotFound) {
      return res.status(404).json({error: err.message})
    }
    throw err
  }
  res.json(todo)
}


export const updateTodoController = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.storage.get(StorageKeys.UPDATE_TODO_PACKET);
  let todo = null
  try {
   todo = await updateTodo(id, { title, description, completed });
  } catch (err) {
    if (err instanceof TodoNotFound) {
      return res.status(404).json({err: err.message})
    }
    throw err
  }
  res.json(todo)
}

export const deleteTodoController = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteTodo(id);
  } catch (err) {
    if (err instanceof TodoNotFound) {
      return res.status(404).json({err: err.message})
    }
    throw err
  }
  res.status(204).send()
}
