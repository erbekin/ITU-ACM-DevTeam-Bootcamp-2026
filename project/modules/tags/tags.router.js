import express from 'express'
import { addTagsController, getTagsController } from './tags.controller.js';
import { validateAddTag } from './tags.validator.js';

const r = express.Router();

r.get('/', getTagsController);
r.post('/', validateAddTag, addTagsController);

export default r;
