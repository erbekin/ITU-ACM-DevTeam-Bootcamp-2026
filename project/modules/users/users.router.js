import express from 'express';
import { addUserController, getUsersController, getProfileController,getUserTodosController, putProfileController } from './users.controller.js';
import { validateAddUser, validateProfile } from './users.validator.js';

const r = express.Router();

r.get('/', getUsersController);
r.post('/', validateAddUser, addUserController);

r.get('/:id/todos', getUserTodosController);
r.get('/:id/profile', getProfileController)
r.put('/:id/profile', validateProfile, putProfileController)
export default r;
