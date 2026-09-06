import { getTodos, addTodo, getTodoById, replaceTodo, updateTodo, deleteTodo } from "./todos.service.js";
import { TodoNotFound } from "./todos.errors.js"
import StorageKeys from "./todos.storage-keys.js"

export const getTodosController = (req, res) => {
  const { completed, q } = req.query;
  res.json(getTodos({ completed, q }));
};

export const addTodoController = (req, res) => {
  const { title, description, userId} = req.body;
  const todo = addTodo(title, description, userId);
  res.status(201).json(todo);
};

export const getTodoByIdController = (req, res) => {
  const { id } = req.params;
  const todo = getTodoById(id);
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

export const replaceTodoController = (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  let todo = null
  try {
    todo = replaceTodo(id, { title, description, completed });

  } catch (err) {
    if (err instanceof TodoNotFound) {
      return res.status(404).json({error: err.message})
    }
    throw err
  }
  res.json(todo)
}


export const updateTodoController = (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.storage.get(StorageKeys.UPDATE_TODO_PACKET);
  let todo = null
  try {
   todo = updateTodo(id, { title, description, completed });
  } catch (err) {
    if (err instanceof TodoNotFound) {
      return res.status(404).json({err: err.message})
    }
    throw err
  }
  res.json(todo)
}

export const deleteTodoController = (req, res) => {
  const { id } = req.params;
  try {
    deleteTodo(id);
  } catch (err) {
    if (err instanceof TodoNotFound) {
      return res.status(404).json({err: err.message})
    }
    throw err
  }
  res.status(204).send()
}
