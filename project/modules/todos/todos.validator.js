import { T } from '../../utils/typeCheckClass.js'
import StorageKeys from './todos.storage-keys.js'
import { getUserById } from "../users/users.service.js";

export const validateAddTodo = (req, res, next) => {
  const typeLayout = T.Object({
    title: T.String,
    description: T.String,
    userId: T.Optional(T.String),
  })
  const result = typeLayout.check(req.body);

  if (!result.ok) {
    res.status(400).json({ error: result.error.message, schemeTrace : result.error.trace });
    return
  }
  const value = result.ok;
  if (value.userId) {
    if (getUserById(value.userId) === undefined) {
      return res.status(400).json({ error: "User not found" });
    }
  }
  next();
};

// TODO (Aşama 1): validateReplaceTodo ve validateUpdateTodo middleware'lerini
// ekleyin.
//
//   validateReplaceTodo (PUT)  → title, description ve completed'ın üçü de
//                                zorunlu ve doğru tipte olmalı.
//   validateUpdateTodo (PATCH) → en az bir geçerli alan gönderilmiş olmalı;
//                                gönderilen alanların tipi doğru olmalı.
//
// Hatırlatma: hata durumunda next() ÇAĞIRMAYIN — zinciri 400 ile kesin.
// Ve res.status(400).json(...) satırının başına   return koymayı unutmayın.

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
    completed: T.Optional(T.Boolean)
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
  if (!data.title && !data.description && !data.completed) {
    return res.status(400).json({
      error: "At least one field required",
    })
  }
  req.storage.set(StorageKeys.UPDATE_TODO_PACKET, data);
  next()
}
