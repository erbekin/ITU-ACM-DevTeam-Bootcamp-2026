import { TodoNotFound } from "./todos.errors.js";

export const todos = [];

export const addTodo = (title, description, userId) => {
  const todo = {
    id: crypto.randomUUID(),
    title,
    description,
    completed: false,
    createdAt: new Date(),
    userId : userId ?? null,
  };
  todos.push(todo);
  return todo;
};

export const getTodos = ({ completed, q } = {}) => {
  let sonuc = todos;

  // --- completed filtresi ---
  // completed bir string: "true", "false" ya da undefined.
  // Sadece bu iki değerden biriyse filtre uygula; başka bir şey
  // geldiyse (ör. ?completed=belki) filtreyi yok say.
  if (completed === "true" || completed === "false") {
    const beklenen = completed === "true";   // string → boolean
    sonuc = sonuc.filter((todo) => todo.completed === beklenen);
  }

  // --- q araması ---
  if (typeof q === "string" && q.trim() !== "") {
    const arama = q.toLowerCase();
    sonuc = sonuc.filter(
      (todo) =>
        todo.title.toLowerCase().includes(arama) ||
        todo.description.toLowerCase().includes(arama),
    );
  }

  return sonuc;
};

/**
 * Search Todos array with id
 * @param {number} id
 * @returns The todo object if found or undefined otherwise
 */
export const getTodoById = (id) => {
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return undefined;
  }
  return todo;
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
 */
export const replaceTodo = (id, data) => {
  const todo = getTodoById(id);
  if (!todo) throw new TodoNotFound(id);

  todo.title = data.title
  todo.description = data.description
  todo.completed = data.completed
  return todo
}

/**
 *  Updates todo with given values.
 * @param {uuid} id id of todo
 * @param {TodoDescriptor} data object with title, completed, description
 * @returns updated todo object
 */
export const updateTodo = (id, data) => {
  const todo = getTodoById(id);
  if (!todo) throw new TodoNotFound(id);
  // update given values, fallback to old value
  todo.title = data.title ?? todo.title;
  todo.completed = data.completed ?? todo.completed;
  todo.description = data.description ?? todo.description;
  return todo;
}

/**
 *  Deletes todo, fails if todo not found
 * @param {uuid} id
 * @returns true if successful false otherwise.
 */
export const deleteTodo = (id) => {
  const todoIdx = todos.findIndex((t) => t.id === id);

  if (todoIdx < 0) throw new TodoNotFound(id);
  todos.splice(todoIdx, 1);
}

/**
 * Returns the list of todos which has userId equals to userId
 * @param {uuid} userId
 * @returns list of todos
 */
export const getTodosByUserId = (userId) => {
  return todos.filter((t) => t.userId === userId)
}
