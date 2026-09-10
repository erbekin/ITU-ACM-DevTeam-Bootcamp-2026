import * as TagsDb from "./tags.db.js"

/**
 * Returns array of Tags. Can be empty array.
 * @returns {Promise<TagsDb.Tag[]>} all tags
 */
export const getTags = async () => {
  return await TagsDb.selectAll();
}


/**
 * Creates new tag. Fails if there is a tag with given name.
 * @param {string} name - name of tag
 * @returns{Promise<?TagsDb.Tag>} - new tag object or null if fails.
 */
export const newTag = async (name) => {
  return await TagsDb.create({
    name
  });
}

/**
 * Associates tag with todo.
 * @param {string} todoId - id of todo
 * @param {*} tagId  - id of tag
 * @throws {ConflictError} if todo already tagged (P2002)
 * @throws {NotFoundError} if todo or tag doesnt exist (P2003)
 * @returns {Promise<TagsDb.TagTodo>} - an object containing ids of todo and tag on success
 */
export const tagTodo = async (todoId, tagId) => {
  return await TagsDb.tagTodo({
    tagId,
    todoId
  });
}

/**
 * Returns array of tags associated with todo. Can be empty array.
 * @param {string} todoId - id of todo
 * @returns {Promise<TagsDb.Tag[]>} - array of tags
 */
export const tagsOfTodo = async (todoId) => {
  return await TagsDb.selectOfTodo({
    todoId
  });
}

/**
 * Removes tag from todo.
 * @param {string} todoId - id of todo
 * @param {string} tagId - id of tag
 * @throws {NotFoundError} if todo or tag doesnt exist (P2003)
 * @returns {Promise<TagsDb.TagTodo>} - an object containing ids of todo and tag on success
 */
export const deleteTagOfTodo = async (todoId, tagId) => {
  return await TagsDb.removeTag({
    tagId,
    todoId
  });
}
