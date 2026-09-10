import prisma from "../../db/prisma.js";
import { handleKnownRequestError } from "../../db/utils.js";
import Fun from "../../utils/fun.js"

/**
 * @typedef SelectTodoFilter
 * @type {object}
 * @property {boolean} [completed] - true for completed todos
 * @property {string} [q] - query string for todo search
 */
/**
 * @typedef Todo
 * @type {object}
 * @property {string} id - UUID of the todo
 * @property {string} title - Title of the todo
 * @property {string} description - Description of the todo
 * @property {boolean} completed - Completion status of the todo
 * @property {number} priority - priority of todo, defaults 0
 * @property {(?string)} [userId] - UUID of the user who owns the todo
 * @property {Date} createdAt - Creation timestamp
 */

 /**
  * Creates new todo
  * @param {{title:string, description:string, userId:string, priority?:number}} todoData - todo create data
  * @return {Promise<Todo>} newly created object
  */
export const create = async (todoData) => {
  return await prisma.todo.create({
    data: {
      title: todoData.title,
      description: todoData.description,
      userId: todoData.userId,
      // The trick: if priority exists in
      // tododata priority: todoData.priority is added to prisma data argument
      // otherwise, nothing added.
      ...Fun.Maybe(todoData.priority)
        .map((p) => ({priority: p}))
        .take()
    },
  })
}

/**
 * Returns all todo records.
 * Optionally accepts a `filters` parameter.
 * @param {SelectTodoFilter} [filters]
 * @returns {Promise<Todo[]>} the list of todos
 */
export const selectMany = async(filters) => {
  const completed = filters?.completed;
  const q = filters?.q;
  // returns OR filter or undefined
  const or = () => {
    if (q == null) return;
    return {
      OR: [
        { description: { contains: q, mode: "insensitive" } },
        { title: { contains: q, mode: "insensitive" } },
      ],
    };
  };

  let res = await prisma.todo.findMany({
    where: {
      ...or(),
      ...Fun.Maybe(completed).map((completed) => ({ completed })).take(),
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return res;
};

/**
 * Select all todos which is referenced to given userId
 * @param {string} userId - id of user
 * @returns {Promise<Todo[]>} - list of todos
 */
export const selectManyOfUser = async (userId) => {
  return await prisma.todo.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
}

/**
 * Select one from Todo entity
 * @param  id - id of todo
 * @returns {Promise<?Todo>} a todo object or null
 */
export const selectOne = async (id) => {
  // returns null if not found
  return await prisma.todo.findUnique({
    where: {
      id
    }
  })
}

/**
 *
 * @typedef TodoUpdateOptions
 * @type {object}
 * @prop {string} id
 * @prop {string} [title]
 * @prop {string} [description]
 * @prop {boolean} [completed]
 * @prop {number} [priority]
 *
 * Updates todo with given values.
 * @param {TodoUpdateOptions} options
 * @returns {Promise<?Todo>} the todo which was updated or null
 */
export const updateOne = async (options) => {
  const makeField = (field) => {
    return Fun.Maybe(options[field]).map((t) => ({ [field]: t })).take()
  }
  return await handleKnownRequestError('P2025', async () => {
    return await prisma.todo.update({
      data: {
        id: options.id,
        ...makeField('title'),
        ...makeField('description'),
        ...makeField('completed'),
        ...makeField('priority'),
      },
      where: {
        id: options.id
      }
    });
  })
}


/**
 * Deletes given row from Todo entity
 * @param {string} id - id of todo
 * @returns {Promise<?Todo>} old todo object if it was deleted, null if it was not found
 */
export const deleteOne = async (id) => {
  return await handleKnownRequestError('P2025', async () => {
    return await prisma.todo.delete({
      where: {
        id: id
      }
    });
  })
}
