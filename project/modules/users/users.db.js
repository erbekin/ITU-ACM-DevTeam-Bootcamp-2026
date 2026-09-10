import prisma from "../../db/prisma.js";
import { handleKnownRequestError } from "../../db/utils.js";
import { ConflictError } from "../errors.js";

/**
 * @typedef User
 * @type {object}
 * @property {string} id - UUID of the user
 * @property {string} username - Unique username
 * @property {string} email - Unique email address
 * @property {string} password - Hashed password
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * Public user interface. Password is removed.
 * @typedef PublicUser
 * @type {object}
 * @property {string} id - UUID of the user
 * @property {string} username - Unique username
 * @property {string} email - Unique email address
 * @property {Date} createdAt - Creation timestamp
 */

const PUBLIC_USER_SELECT = {
  id: true,
  username: true,
  email: true,
  createdAt: true,
};
// disallow modifications
Object.freeze(PUBLIC_USER_SELECT);

/**
 * Creates new user
 * @param {{username:string, email:string, password:string}} userData
 * @returns {Promise<User>} newly created user object
 * @throws {ConflictError} if unique violation occured
 */
export const create = async (userData) => {
  // handle unique violation
  return handleKnownRequestError(
    "P2002",
    async () => {
      return await prisma.user.create({
        data: {
          username: userData.username,
          email: userData.email,
          password: userData.password,
        },
        select: PUBLIC_USER_SELECT,
      });
    },
    (err) => {
      throw new ConflictError("email or username already taken", {
        meta: err?.meta,
        internalMessage: err?.message,
      });
    },
  );
};

/**
 * @returns {Promise<PublicUser[]>}- All users as an array
 */
export const selectManyPublic = async () => {
  return await prisma.user.findMany({
    select: PUBLIC_USER_SELECT,
  });
};

/**
 * @typedef UserSelectArg
 * @type {object}
 * @prop {'id'|'email'} kind + email or id
 * @prop {string} value - the value string, uuid for id, Mail string for email
 *
 * Selects one users with either email or id
 *
 * @param {UserSelectArg} arg
 * @returns {Promise<?PublicUser>} user or null if not found
 */
export const selectOnePublic = async (arg) => {
  const { kind, value } = arg;
  const condition = () => {
    if (kind === "id") {
      return {
        id: value,
      };
    } else if (kind === "email") {
      return {
        email: value,
      };
    } else {
      // just in case
      throw new TypeError("kind must be one of: 'id', 'email'");
    }
  };
  return await prisma.user.findUnique({
    where: condition(),
    select: PUBLIC_USER_SELECT,
  });
};

/**
 * @typedef PublicProfile
 * @type {object}
 * @prop {string} userId - id of user this profile belongs
 * @prop {string} bio - description of profile
 *
 * Selects related profile of given user
 * @param {string} userId - uuid of user
 * @return {Promise<?PublicProfile>} profile of user or null
 */
export const selectProfile = async (userId) => {
  return await prisma.profile.findUnique({
    where: {
      userId,
    },
    select: {
      bio: true,
    },
  });
};

/**
 * @typedef ProfileArgs
 * @type {object}
 * @prop {string} userId - uuid of user
 * @prop {string} bio - bio of user
 *  Create or update profile
 * @param {ProfileArgs} args
 */
export const upsertProfile = async (args) => {
  return await prisma.profile.upsert({
    where: { userId: args.userId },
    update: { bio: args.bio },
    create: { userId: args.userId, bio: args.bio },
    select: { id: true, bio: true, userId: true },
  });
};
