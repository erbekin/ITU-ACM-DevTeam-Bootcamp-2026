// Aşama 2 — users modülünün CONTROLLER katmanı.
//
// Yazmanız gerekenler:
//
//   addUserController        → 201 + { id, username, email }   (password YOK)
//                              e-posta zaten kayıtlıysa 409
//   getUsersController       → 200 + kullanıcı listesi          (password YOK)
//   getUserTodosController   → 200 + o kullanıcının todoları
//                              kullanıcı yoksa 404
//
// Aşama 3 notu: getUserTodosController'ın todoları bulabilmesi için
// todos modülünün SERVICE katmanını çağırması gerekir. Derste konuştuğumuz
// altın kural: başka modülün service'ini çağırabilirsin, iç dosyalarına
// (db, controller, validator) dokunamazsın.

import { addUser, getUserByEmail, getUsers, getUserById } from "./users.service.js";
import { getTodosByUserId } from "../todos/todos.service.js";
import Fun from "../../utils/fun.js";
import { ConflictError } from "./users.error.js";

export const addUserController = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await addUser(username, email, password);
    res.status(201).json(user);
  } catch (e) {
    if (e instanceof ConflictError) {
      res.status(409).json({
        error: e.message,
        detail: e.field ?? null,
      });
      return;
    }
    throw e;
  }
};

export const getUsersController = async (req, res) => {
  const users = await getUsers();
  res.json(users);
};

export const getUserTodosController = async (req, res) => {
  const { id } = req.params;
  if (!(await getUserById(id))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  const todos = await getTodosByUserId(id);
  res.json(todos);
};
