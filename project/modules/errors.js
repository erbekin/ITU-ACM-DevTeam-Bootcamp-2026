
/**
 * @classdesc Represents conflicts in database
 */
export class ConflictError extends Error {
  constructor(message, detail) {
    super(message);
    this.detail = detail ?? {};
  }
}

export class NotFoundError extends Error {
  constructor(message, detail) {
    super(message);
    this.detail = detail ?? {}
  }
}
