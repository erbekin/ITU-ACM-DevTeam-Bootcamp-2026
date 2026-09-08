// utils/fun.js

/**
 * Checks whether a value is null or undefined.
 * Uses `==` intentionally: `value == null` is true for both
 * null and undefined, false for everything else.
 */
function isNil(value) {
  return value == null;
}

/**
 * Inverse of isNil.
 */
function isSome(value) {
  return value != null;
}

function Maybe(val) {
  if (!(this instanceof Maybe)) {
    return new Maybe(val);
  }
  this.val = val;
  this.kind = isNil(val) ? 'nil' : 'some';
}

/**
 * Transforms the value if present. No-op on nil.
 * Returns a NEW Maybe — never mutates `this`.
 * Re-checks nil-ness of the result, so mapping to
 * null/undefined correctly collapses to nil.
 */
Maybe.prototype.map = function mapFn(f) {
  if (this.kind === 'nil') return this;
  return Maybe(f(this.val));
};

/**
 * Like map, but for functions that themselves return a Maybe.
 * Prevents Maybe(Maybe(x)) nesting.
 * e.g. Fun.Maybe(user).chain(u => Fun.Maybe(u.address))
 */
Maybe.prototype.chain = function chainFn(f) {
  if (this.kind === 'nil') return this;
  const result = f(this.val);
  return result instanceof Maybe ? result : Maybe(result);
};

/**
 * Keeps the value only if predicate returns true; else becomes nil.
 */
Maybe.prototype.filter = function filterFn(predicate) {
  if (this.kind === 'nil') return this;
  return predicate(this.val) ? this : Maybe(null);
};

/**
 * Runs a side effect on the value without changing the chain.
 * Useful for logging/debugging mid-chain.
 */
Maybe.prototype.inspect = function inspectFn(f) {
  if (this.kind === 'some') f(this.val);
  return this;
};

/**
 * Extracts the value, or a default if nil.
 */
Maybe.prototype.unwrapOr = function unwrapOrFn(defaultVal) {
  return this.kind === 'nil' ? defaultVal : this.val;
};

/**
 * Like unwrapOr, but the default is computed lazily —
 * useful when producing the fallback is expensive.
 */
Maybe.prototype.unwrapOrElse = function unwrapOrElseFn(fn) {
  return this.kind === 'nil' ? fn() : this.val;
};

/**
 * Falls back to another Maybe (not a raw value) if nil.
 * Useful for chaining alternative sources:
 * Fun.Maybe(cache.get(k)).orElse(() => Fun.Maybe(db.get(k)))
 */
Maybe.prototype.orElse = function orElseFn(fn) {
  return this.kind === 'nil' ? fn() : this;
};

/**
 * Pattern-match style branching — handles both cases explicitly
 * at the point you actually need to decide something.
 */
Maybe.prototype.match = function matchFn({ some, nil }) {
  return this.kind === 'some' ? some(this.val) : nil();
};

/**
 * Extracts the raw value regardless of kind.
 */
Maybe.prototype.take = function takeFn() {
  return this.val;
};

const Fun = {
  isNil,
  isSome,
  Maybe,
};

export default Fun;
