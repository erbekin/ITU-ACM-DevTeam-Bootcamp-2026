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
 * @property {(?string)} [userId] - UUID of the user who owns the todo
 * @property {Date} createdAt - Creation timestamp
 */

 /**
  * Creates new todo
  * @param {{title:string, description:string, userId:string}} - todo create data
  * @return {Promise<Todo>} newly created object
  */
export const create = async (todoData) => {
  return await prisma.todo.create({
    data: {
      title: todoData.title,
      description: todoData.description,
      userId: todoData.userId
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
      // spreading null adds nothing
      ...completed == Fun.Maybe(completed).map((completed) => ({completed})).unwrapOr(null),
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
    include: {
      user: true,
    },
    where: {
      user: {
        id: userId
      }
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
 * Updates todo with given values.
 * @param {TodoUpdateOptions} options
 * @returns {Promise<?Todo>} the todo which was updated or null
 */
export const updateOne = async (options) => {
  return await handleKnownRequestError('P2025', async () => {
    return await prisma.todo.update({
      data: {
        id: options.id,
        ...Fun.Maybe(options.title).map((t) => ({ title: t })).unwrapOr(null),
        ...Fun.Maybe(options.description).map((t) => ({ description: t })).unwrapOr(null),
        ...Fun.Maybe(options.completed).map((t) => ({ completed: t })).unwrapOr(null)
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
