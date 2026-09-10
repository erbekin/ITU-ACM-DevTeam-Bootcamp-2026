import Fun from '../../utils/fun.js';
import { isUuidV4 } from '../../utils/is-uuid.js';
import { T } from '../../utils/typeCheckClass.js'
import StorageKeys from './todos.storage-keys.js'

export const validateGetTodoQuery = (req, res, next) => {
  const query = req.query;
  const packet = {};
  if (typeof query.completed === 'string') {
    packet.completed = query.completed === 'true';
  }
  if (typeof query.q === 'string') {
    packet.q = query.q;
  }
  req.storage.set(StorageKeys.GET_TODO_QUERY_PACKET, packet)
  next()
}

export const validateAddTodo = async (req, res, next) => {
  const typeLayout = T.Object({
    title: T.String,
    description: T.String,
    userId: T.Optional(T.String),
    priority : T.Optional(T.Number),
  })
  const result = typeLayout.check(req.body);

  if (!result.ok) {
    res.status(400).json({ error: result.error.message, schemeTrace : result.error.trace });
    return
  }
  next();
};

export const validateReplaceTodo = (req, res, next) => {
  let typeLayout = T.Object({
    title: T.String,
    description: T.String,
    completed: T.Boolean
  });
  const data = typeLayout.check(req.body)
  if (!data.ok) {
    res.status(400).json({
      error: data.error.message,
    });
    return
  }
  next()
}



export const validateUpdateTodo = (req, res, next) => {
  let typeLayout = T.Object({
    title: T.Optional(T.String),
    description: T.Optional(T.String),
    completed: T.Optional(T.Boolean),
    priority: T.Optional(T.Number),
  });
  const result = typeLayout.check(req.body)
  if (!result.ok) {
    res.status(400).json({
      error: result.error.message,
    })
    return
  }
  const data = result.ok;
  // at least one property required
  if (!data.title && !data.description && !data.completed && !data.priority) {
    return res.status(400).json({
      error: "At least one field required",
    })
  }
  // priority is integer
  if (Fun.isSome(data.priority) && !Number.isInteger(data.priority)) {
    return res.status(400).json({
      error: "the property 'priority' must be integer"
    })
  }
  req.storage.set(StorageKeys.UPDATE_TODO_PACKET, data);
  next()
}

export const validateAddTag = (req, res, next) => {
  if (!req.is('json')) {
    res.status(400).json({ error: "expected json body" });
    return;
  }
  const result = T.Object({
    tagId: T.String,
  }).check(req.body);
  if (!result.ok) {
    res.status(404).json({ error: result.error.message });
    return;
  }
  if (!isUuidV4(result.ok.tagId)) {
    res.status(400).json({ error: "invalid id format" });
    return;
  }

  next()
}
