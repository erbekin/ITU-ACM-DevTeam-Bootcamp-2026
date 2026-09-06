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

const users = []

/**
 * Add new user to the users list
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns the user objects
 */
export const addUser = (username, email, password) => {
  const user = {
    id: crypto.randomUUID(),
    username,
    email,
    password,
    createdAt : new Date()
  }
  users.push(user)
  return user
}

/**
 * @returns all users
 */
export const getUsers = () => {
  return users;
}

/**
 * Returns user record with given id if exists
 * @param {uuid} id
 * @returns user object or undefined if not found
 */
export const getUserById = (id) => {
  return users.find((u) => u.id === id);
}

/**
 * Finds user with given email
 * @param {string} email
 * @returns user or undefined if not found
 */
export const getUserByEmail = (email) => {
  return users.find((u) => u.email === email)
}
