export class T {
  static get String() {
    return new T(new PrimitiveChecker("string"));
  }
  static get Number() {
    return new T(new PrimitiveChecker("number"));
  }
  static get Boolean() {
    return new T(new PrimitiveChecker("boolean"));
  }
  static Object(descriptor) {
    return new T(new ObjectChecker(descriptor));
  }
  static Optional(t) {
    if (t.checker.type === "optional") return t;
    return new T(new OptionalChecker(t));
  }
  constructor(checker) {
    this.checker = checker;
  }

  check(val, ctx) {
    return this.checker.check(
      val,
      ctx ?? {
        objectFields: ["<root-object>"],
      },
    );
  }
}

class ObjectChecker {
  type = "object";
  // [{key : 'key', checker: Checker}...]
  types = [];
  constructor(descriptor) {
    for (let [key, checker] of Object.entries(descriptor)) {
      this.types.push({
        key,
        checker,
      });
    }
  }
  check(val, ctx) {
    if (typeof val !== "object" || val === null) {
      return { error: new Error(`expected a value of type 'object' but found type '${typeof val}'`) };
    }
    for (let { key, checker } of this.types) {
      ctx.objectFields.push(key);
      const result = checker.check(val[key], ctx);
      // stop on error
      if ("error" in result) {
        if (!ctx.traceDumped) {
          // console.log("objecttrace: ", ctx.objectFields.join("."));
          result.error.trace = ctx.objectFields.join(".");
          ctx.traceDumped = true;
        }
        return result;
      }
      ctx.objectFields.pop();
    }
    return { ok: val };
  }
}

class PrimitiveChecker {
  constructor(type) {
    this.type = type;
  }
  check(val, ctx) {
    if (typeof val !== this.type) {
      return {
        error: new Error(`expected a value of type '${this.type}' but found type '${typeof val}'`),
      };
    }
    return { ok: val };
  }
}

class OptionalChecker {
  type = "optional";
  constructor(innerType) {
    this.innerType = innerType;
  }
  check(val, ctx) {
    if (val === null || val === undefined) {
      return { ok: val };
    }
    return this.innerType.check(val, ctx);
  }
}

// let nested = T.Object({
//   a: T.Object({
//     b: T.Object({
//       c : T.String
//     })
//   })
// })

// console.log(nested.check({
//   a: {
//     b: {
//       c: 5
//     }
//   }
// }));
