// Aşama 2 — users modülünün SERVICE katmanı.
//
// Bu katman HTTP bilmez: req/res görmez, status kodu seçmez.
// Parametre alır, iş yapar, sonuç döndürür.
//
// Yazmanız gerekenler:
//
//   users                          → in-memory dizi (todos.service.js'teki gibi)
//   addUser(username, email, password)
//       → { id, username, email, password, createdAt } oluşturup diziye ekler
//       → id için crypto.randomUUID() kullanın
//   getUsers()                     → tüm kullanıcılar
//   getUserById(id)                → tek kullanıcı, yoksa undefined
//   getUserByEmail(email)          → e-posta benzersizlik kontrolü için
//
// DİKKAT: password alanı bellekte saklanır ama hiçbir yanıtta dönmemeli.
// Bunu nerede çözeceğiniz size kalmış — service'te "password'süz kopya"
// döndürmek de, controller'da ayıklamak da kabul edilir.

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import * as UserDb from "./users.db.js";
import { ConflictError } from "./users.error.js";

/**
 * Add new user to the users list
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns the user object
 */
export const addUser = async (username, email, password) => {
  return await UserDb.create({
    username,
    email,
    password,
  });
};

/**
 * @returns all users
 */
export const getUsers = async () => {
  return await UserDb.selectManyPublic();
};

/**
 * Returns user record with given id if exists
 * @param {uuid} id
 * @returns user object or null if not found
 */
export const getUserById = async (id) => {
  return await UserDb.selectOnePublic({
    kind: "id",
    value: id,
  });
};

/**
 * Finds user with given email
 * @param {string} email
 * @returns user or null if not found
 */
export const getUserByEmail = async (email) => {
  return await UserDb.selectOnePublic({
    kind: "email",
    value: email,
  });
};
