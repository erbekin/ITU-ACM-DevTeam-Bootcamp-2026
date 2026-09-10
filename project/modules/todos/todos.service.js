import { TodoNotFound } from "./todos.errors.js";
import * as TodoDb from "./todos.db.js";
import Fun from "../../utils/fun.js";
/**
 * @typedef {import("./todos.db.js").SelectTodoFilter} SelectTodoFilter
 */

 /**
  *@typedef AddTodoParams
  * @type {object}
  * @prop {string} title
  * @prop {string} description
  * @prop {string} userId - uuid of user
  * @prop {number} [priority] - priority of todo, default it 0
  *
  * @param {AddTodoParams} params
  * @returns
  */
export const addTodo = async (params) => {
  return await TodoDb.create(params);
};


/**
 *  Get all todos
 * @param {SelectTodoFilter} filters
 * @returns The array of todos
 */
export const getTodos = async (filters) => {
  return await TodoDb.selectMany(filters);
};

/**
 * Search Todos array with id
 * @param id - id of todo
 * @returns The todo object if found or undefined otherwise
 */
export const getTodoById = async (id) => {
  return await TodoDb.selectOne(id);
};


// TODO (Aşama 1): replaceTodo, updateTodo ve deleteTodo fonksiyonlarını ekleyin.
//
// Hatırlatma: service katmanı req/res görmez. Parametre alır, iş yapar,
// sonuç döndürür. Bulunamayan kayıt için status kodu seçmek controller'ın işi;
// service sadece "bulamadım" bilgisini döndürsün (ör. undefined).

/**
 *  Replaces a todo data with new data
 * @param  id uuid of todo to replace
 * @param  data contains keys title, description and completed, all fields are required
 * @returns the replaced todo object
 * @throws TodoNotFound
 */
export const replaceTodo = async (id, data) => {
  const result = await TodoDb.updateOne({ id, ...data });
  if (Fun.isNil(result)) {
    throw new TodoNotFound(id);
  }
  return result;
}

/**
 *  Updates todo with given values.
 * @param {uuid} id id of todo
 * @param {TodoDescriptor} data object with title, completed, description
 * @returns updated todo object
 */
export const updateTodo = async (id, data) => {
  let result = await TodoDb.updateOne({
    id,
    ...data
  });
  if (Fun.isNil(result)) {
    throw new TodoNotFound(id);
  }
  return result;
}

/**
 *  Deletes todo, fails if todo not found
 * @param {uuid} id
 * @throws TodoNotFound
 */
export const deleteTodo = async (id) => {
  const result = await TodoDb.deleteOne(id);
  if (Fun.isNil(result)) {
    throw new TodoNotFound(id)
  }
}

/**
 * Returns the list of todos which has userId equals to userId
 * @param {string} userId
 * @returns list of todos
 */
export const getTodosByUserId = async (userId) => {
  return await TodoDb.selectManyOfUser(userId);
}
