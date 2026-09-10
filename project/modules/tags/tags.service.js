import * as TagsDb from "./tags.db.js"


export const getTags = async () => {
  return await TagsDb.selectAll();
}

export const newTag = async (name) => {
  return await TagsDb.create({
    name
  });
}

export const tagTodo = async (todoId, tagId) => {
  return await TagsDb.tagTodo({
    tagId,
    todoId
  });
}

export const tagsOfTodo = async (todoId) => {
  return await TagsDb.selectOfTodo({
    todoId
  });
}

export const deleteTagOfTodo = async (todoId, tagId) => {
  return await TagsDb.removeTag({
    tagId,
    todoId
  });
}
