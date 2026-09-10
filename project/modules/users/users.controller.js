import { addUser, getUserByEmail, getUsers, getUserById ,getProfile, createOrUpdateProfile} from "./users.service.js";
import { getTodosByUserId} from "../todos/todos.service.js";
import { ConflictError } from "../errors.js";
import Fun from "../../utils/fun.js";

export const addUserController = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await addUser(username, email, password);
    res.status(201).json(user);
  } catch (e) {
    if (e instanceof ConflictError) {
      res.status(409).json({
        error: e.message,
      });
      return;
    }
    throw e;
  }
};

export const getUsersController = async (req, res) => {
  const users = await getUsers();
  res.json(users);
};

export const getUserTodosController = async (req, res) => {
  const { id } = req.params;
  if (!(await getUserById(id))) {
    res.status(404).json({ error: "user not found" });
    return;
  }
  const todos = await getTodosByUserId(id);
  res.json(todos);
};

export const getProfileController = async (req, res) => {
  const { id } = req.params;
  const profile = await getProfile(id);
  if (Fun.isNil(profile)) {
    res.status(404).json({
      error: "no profile found for user",
      userId : id
    })
    return;
  }
  res.json(profile);
}

export const putProfileController = async (req, res) => {
  const { id } = req.params;
  if (Fun.isNil(await getUserById(id))) {
    res.status(404).json({ error: `user with id ${id} not found` })
    return;
  }
  const {bio} = req.body;
  const r = await createOrUpdateProfile({
    userId: id,
    bio
  });
  res.json(r)
}
