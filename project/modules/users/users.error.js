
/**
 * @classdesc This error thrown by service
 */
export class ConflictError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
  }
}
