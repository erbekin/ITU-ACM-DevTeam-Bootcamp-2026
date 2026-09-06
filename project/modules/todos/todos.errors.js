
export class TodoNotFound extends Error {
  constructor(id) {
    super(`Todo with id '${id}' not found. ID might be wrong or it might have been deleted`);
  }
}
