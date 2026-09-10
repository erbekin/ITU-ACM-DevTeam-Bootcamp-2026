import Fun from "../../utils/fun.js";
import { getTags, newTag } from "./tags.service.js"

export const getTagsController = async (req, res) => {
  const tags = await getTags();
  res.json(tags);
}

export const addTagsController = async (req, res) => {
  const { name } = req.body;
  if (name.trim() === '') {
    res.status(400).json({ error: "tag name must not be empty" });
    return;
  }
  const tag = await newTag(name);
  if (Fun.isNil(tag)) {
    res.status(409).json({ error: "tag already exists" });
    return;
  }
  res.status(201).json(tag);
}
