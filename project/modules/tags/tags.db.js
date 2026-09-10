import prisma from "../../db/prisma.js";
import { handleKnownRequestError } from "../../db/utils.js";
import { ConflictError, NotFoundError } from "../errors.js";


/**
 * @typedef Tag
 * @type{object}
 * @prop{String} id - id of tag
 * @prop{string} name - name of tag
 */

/**
 * Represents a tag associated with a todo.
 * @typedef TagTodo
 * @type {object}
 * @prop {string} todoId - id of todo
 * @prop {string} tagId - id of tag
 */

/**
 * @typedef CreateArgs
 * @type {object}
 * @prop {string} name - name of tag
 *
 * Creates a new tag
 * @param {CreateArgs} args
 * @returns {Promise<?Tag>} tag object or null if a tag with same name already exists
 */
export const create = async (args) => {
  return await handleKnownRequestError("P2002", async () => {
    return await prisma.tag.create({
      data: {
        name: args.name
      }
    });
  })
}

/**
 * @returns {Promise<Tag[]>} all tags
 */
export const selectAll = async () => {
  return await prisma.tag.findMany({
    orderBy: {
      name: 'asc'
    }
  });
}

/**
 * @typedef TagTodoArgs
 * @type{object}
 * @prop {string} todoId - id of todo
 * @prop{String} tagId - id of tag
 *
 * Tags a todo with a tag.
 * @param {TagTodoArgs} args
 * @throws {ConflictError} if todo already tagged (P2002)
 * @throws {NotFoundError} if todo or tag doesnt exist (P2003)
 * @returns {Promise<TagTodo>} an object containing ids of todo and tag on success
 */
export const tagTodo = async (args) => {
  return await handleKnownRequestError(['P2002', 'P2003'], async () => {
    return await prisma.todoTag.create({
      data: {
        tagId: args.tagId,
        todoId: args.todoId,
      }
    });
  }, (err) => {
    if (err.code === 'P2002') {
      throw new ConflictError("The todo already tagged", {
        meta: err.meta
      })
    } else if (err.code === 'P2003') {
      throw new NotFoundError("todo or tag not found", {
        meta: err.meta,
      })
    } else {
      throw new Error('unreachable');
    }
  })
}

/**
 * @typedef SelectOfTodoArgs
 * @prop{string} todoId - id of todo
 *
 * Select all tags which tags given todo
 * @param {SelectOfTodoArgs} args
 * @returns{Promise<Tag[]>} array of tags of todo
 */
export const selectOfTodo = async (args) => {
  return await prisma.tag.findMany({
    where: {
      todoTags: {
        some: {
          todoId: args.todoId
        }
      }
    }
  })
}

/**
 * @typedef RemoveTagArgs
 * @prop {string} todoId - id of todo
 * @prop {string} tagId - id of tag
 *
 * Deletes from todo tags where todoId is given id
 * @param {RemoveTagArgs} args
 * @throws {NotFoundError} if record not found
 * @returns deleted TodoTag ids
 *
 */
export const removeTag = async (args) => {
  return await  handleKnownRequestError('P2025', async () => {
    return await prisma.todoTag.delete({
      where: {
        todoId_tagId: {
          tagId: args.tagId,
          todoId: args.todoId,
        },
      }
    });
  }, (err) => {
    throw new NotFoundError("No record found to delete", err);
  });

}
