import { T } from "../../utils/typeCheckClass.js";

export const validateAddTag = (req, res, next) => {
  if (!req.is('json')) {
    res.status(400).json({ error: "expected json body" });
    return;
  }
  const result = T.Object({
    name: T.String
  }).check(req.body);
  if (!result.ok) {
    res.status(400).json({ error: result.error.message });
    return;
  }
  next()
}
