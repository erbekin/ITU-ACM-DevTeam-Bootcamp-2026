// Aşama 2 — users modülünün VALIDATOR katmanı.
//
// Yazmanız gerekenler:
//
//   validateAddUser(req, res, next)
//       → username, email ve password zorunlu ve string olmalı
//       → email en azından "@" içermeli
//       → kural ihlalinde 400 ile zinciri kesin, next() çağırmayın
//
// Hatırlatma: "bu e-posta zaten kayıtlı" kontrolü bir doğrulama değil,
// bir iş kuralıdır — ve 400 değil 409 döner. Onu service/controller
// tarafında çözmek daha doğru.

import {T} from '../../utils/typeCheckClass.js'

export const validateAddUser = async (req, res, next) => {
  const typeLayout = T.Object({
    username: T.String,
    email: T.String,
    password: T.String
  });
  const result = typeLayout.check(req.body);
  // break the chain
  if (!result.ok) {
    res.status(400).json({ error: result.error.message });
    return;
  }
  const val = result.ok;
  // '@' check
  if (!val.email.includes('@')) {
    res.status(400).json({ error: "email must contain '@'" });
    return;
  }
  next()
}
