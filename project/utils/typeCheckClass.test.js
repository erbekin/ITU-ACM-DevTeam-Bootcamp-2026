import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { T } from "./typeCheckClass.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Asserts the result is a success and optionally checks the value. */
function assertOk(result, expected) {
  assert.ok("ok" in result, `Expected ok but got error: ${result.error?.message}`);
  if (expected !== undefined) {
    assert.strictEqual(result.ok, expected);
  }
}

/** Asserts the result is an error and optionally checks the message. */
function assertError(result, pattern) {
  assert.ok("error" in result, "Expected an error result but got ok");
  assert.ok(result.error instanceof Error, "error should be an Error instance");
  if (pattern) {
    assert.match(result.error.message, pattern);
  }
}

// ---------------------------------------------------------------------------
// T.String
// ---------------------------------------------------------------------------

describe("T.String", () => {
  test("accepts a valid string", () => {
    assertOk(T.String.check("hello"), "hello");
  });

  test("accepts an empty string", () => {
    assertOk(T.String.check(""), "");
  });

  test("rejects a number", () => {
    assertError(T.String.check(42), /string/);
  });

  test("rejects a boolean", () => {
    assertError(T.String.check(true), /string/);
  });

  test("rejects null", () => {
    assertError(T.String.check(null), /string/);
  });

  test("rejects undefined", () => {
    assertError(T.String.check(undefined), /string/);
  });

  test("rejects an object", () => {
    assertError(T.String.check({ a: 1 }), /string/);
  });
});

// ---------------------------------------------------------------------------
// T.Number
// ---------------------------------------------------------------------------

describe("T.Number", () => {
  test("accepts a positive number", () => {
    assertOk(T.Number.check(42), 42);
  });

  test("accepts zero", () => {
    assertOk(T.Number.check(0), 0);
  });

  test("accepts a negative number", () => {
    assertOk(T.Number.check(-3.14), -3.14);
  });

  test("rejects a numeric string", () => {
    assertError(T.Number.check("42"), /number/);
  });

  test("rejects a boolean", () => {
    assertError(T.Number.check(false), /number/);
  });

  test("rejects null", () => {
    assertError(T.Number.check(null), /number/);
  });

  test("rejects undefined", () => {
    assertError(T.Number.check(undefined), /number/);
  });
});

// ---------------------------------------------------------------------------
// T.Boolean
// ---------------------------------------------------------------------------

describe("T.Boolean", () => {
  test("accepts true", () => {
    assertOk(T.Boolean.check(true), true);
  });

  test("accepts false", () => {
    assertOk(T.Boolean.check(false), false);
  });

  test("rejects the string 'true'", () => {
    assertError(T.Boolean.check("true"), /boolean/);
  });

  test("rejects 1 (truthy number)", () => {
    assertError(T.Boolean.check(1), /boolean/);
  });

  test("rejects null", () => {
    assertError(T.Boolean.check(null), /boolean/);
  });
});

// ---------------------------------------------------------------------------
// T.Optional
// ---------------------------------------------------------------------------

describe("T.Optional", () => {
  test("accepts null and returns ok: null", () => {
    assertOk(T.Optional(T.String).check(null), null);
  });

  test("accepts undefined and returns ok: undefined", () => {
    const result = T.Optional(T.String).check(undefined);
    assertOk(result);
    assert.strictEqual(result.ok, undefined);
  });

  test("accepts the correct inner type when a value is present", () => {
    assertOk(T.Optional(T.String).check("hello"), "hello");
  });

  test("rejects a wrong type even when the field is optional", () => {
    // Optional only skips null/undefined — a wrong real value is still an error.
    assertError(T.Optional(T.String).check(99), /string/);
  });

  test("works with T.Number as the inner type", () => {
    assertOk(T.Optional(T.Number).check(0), 0);
    assertOk(T.Optional(T.Number).check(null), null);
    assertError(T.Optional(T.Number).check("nope"), /number/);
  });

  test("works with T.Object as the inner type", () => {
    const schema = T.Optional(T.Object({ x: T.Number }));
    assertOk(schema.check(null), null);
    assertOk(schema.check({ x: 5 }));
    assertError(schema.check({ x: "bad" }));
  });
});

// ---------------------------------------------------------------------------
// T.Object — flat
// ---------------------------------------------------------------------------

describe("T.Object — flat schema", () => {
  const schema = T.Object({ name: T.String, age: T.Number, active: T.Boolean });

  test("accepts a fully valid object", () => {
    assertOk(schema.check({ name: "Alice", age: 30, active: true }));
  });

  test("rejects null", () => {
    assertError(schema.check(null), /object/);
  });

  test("rejects a string", () => {
    assertError(schema.check("not an object"), /object/);
  });

  test("rejects a number", () => {
    assertError(schema.check(123), /object/);
  });

  test("rejects when a field has the wrong type", () => {
    assertError(schema.check({ name: "Alice", age: "thirty", active: true }), /number/);
  });

  test("rejects when a required field is missing (undefined)", () => {
    // undefined fails the primitive checker since typeof undefined !== 'string'
    assertError(schema.check({ age: 30, active: true }));
  });

  test("accepts extra fields that are not in the schema", () => {
    // ObjectChecker only iterates over declared keys — extras are ignored.
    assertOk(schema.check({ name: "Bob", age: 25, active: false, extra: "ignored" }));
  });
});

// ---------------------------------------------------------------------------
// T.Object — with optional fields
// ---------------------------------------------------------------------------

describe("T.Object — optional fields", () => {
  const schema = T.Object({
    username: T.String,
    nickname: T.Optional(T.String),
    score: T.Optional(T.Number),
  });

  test("accepts object with all fields present", () => {
    assertOk(schema.check({ username: "alice", nickname: "ali", score: 100 }));
  });

  test("accepts object where optional fields are null", () => {
    assertOk(schema.check({ username: "alice", nickname: null, score: null }));
  });

  test("accepts object where optional fields are absent (undefined)", () => {
    assertOk(schema.check({ username: "alice" }));
  });

  test("rejects wrong type for an optional field when a value is provided", () => {
    assertError(schema.check({ username: "alice", score: "not a number" }), /number/);
  });
});

// ---------------------------------------------------------------------------
// T.Object — nested / deep
// ---------------------------------------------------------------------------

describe("T.Object — nested schemas", () => {
  const schema = T.Object({
    user: T.Object({
      profile: T.Object({
        age: T.Number,
      }),
    }),
  });

  test("accepts a deeply nested valid object", () => {
    assertOk(schema.check({ user: { profile: { age: 25 } } }));
  });

  test("rejects when a deeply nested value has the wrong type", () => {
    const result = schema.check({ user: { profile: { age: "old" } } });
    assertError(result, /number/);
  });

  test("error message contains an 'Object Trace' for nested failures", () => {
    const result = schema.check({ user: { profile: { age: "old" } } });
    assertError(result, /Object Trace/);
  });

  test("rejects when an inner object is null", () => {
    assertError(schema.check({ user: null }), /object/);
  });

  test("rejects when an inner object is missing entirely", () => {
    assertError(schema.check({ user: undefined }), /object/);
  });
});
