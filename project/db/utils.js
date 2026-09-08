import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client.js";
import Fun from "../utils/fun.js";

/**
 * Handles PrismaClientKnownRequestError error
 * Some query functions returns this error.
 * For example: update and delete returns this when row not found.
 * This function calls f, catches this error.
 * On success, f() is returned.
 * On error, errCallback(err) is returned.
 *
 *
 * **Note**: If errCallback is not provided, null is returned.
 * @param {string|string[]} code - string code to handle or array of codes.e.g. P2025
 * @param  f  - function to call, can be async
 * @param {*} errCallback called if given on error
 * @private
 */
export const handleKnownRequestError = async (code, f, errCallback) => {
  try {
    const result = f();
    if (!!result && (typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
      if (!(result instanceof Promise)) {
        throw new Error("expected promise since it looks like a promise, but it was not instance of Promise??");
      }
      return await result;
    }
    return result;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      const matched = () => {
        if (Array.isArray(code)) {
          return code.includes(e.code)
        } else {
          return code === e.code
        }
      };
      if (matched()) {
        return Fun.isNil(errCallback) ? null : errCallback(e);
      }
    }
    throw e
  }
}
