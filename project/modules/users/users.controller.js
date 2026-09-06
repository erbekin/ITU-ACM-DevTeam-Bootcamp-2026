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

export const addUserController = (req, res) => {
  const { username, email, password } = req.body;
  if (getUserByEmail(email)) {
    // email already registered
    res.status(409).json({ error: `email ${email} is already registered` });
    return
  }
  const { id } = addUser(username, email, password);
  res.status(201).json({
    id,
    username,
    email
  })
}

export const getUsersController = (req, res) => {
  const users = getUsers().map(({ id, username, email, createdAt }) => {
    return {id, username, email, createdAt}
  })
  res.json(users)
}

export const getUserTodosController = (req, res) => {
  const { id } = req.params;
  if (!getUserById(id)) {
    res.status(404).json({ error: "user not found" });
    return
  }
  const todos = getTodosByUserId(id);
  res.json(todos)
}
