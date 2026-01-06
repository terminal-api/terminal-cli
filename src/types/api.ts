/**
 * Type utilities for enforcing OpenAPI spec compliance at compile time.
 *
 * This module provides types that ensure all API operations from the OpenAPI spec
 * have corresponding CLI commands. Uses compile-time type checking to catch
 * missing or extra commands.
 */

// ============================================================================
// Type Utilities
// ============================================================================

/** Helper to assert two types are equal */
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

/** Helper to expect a type to be true */
export type Expect<T extends true> = T;

/** Get keys that are in A but not in B */
export type Difference<A, B> = A extends B ? never : A;

/** Check if a union is empty (equals never) */
export type IsNever<T> = [T] extends [never] ? true : false;

// ============================================================================
// Command Validation Types
// ============================================================================

/**
 * Validate that implemented commands match expected commands.
 *
 * Usage:
 * ```ts
 * type _Validate = ValidateCommands<ExpectedCommands, ImplementedCommands>;
 * ```
 *
 * This will produce a compile error if:
 * - Any expected command is missing from implemented
 * - Any extra command exists in implemented but not expected
 */
export type ValidateCommands<Expected extends string, Implemented extends string> = {
  /** Commands expected but not implemented */
  missing: Difference<Expected, Implemented>;
  /** Commands implemented but not expected */
  extra: Difference<Implemented, Expected>;
  /** True if all commands match */
  isValid: IsNever<Difference<Expected, Implemented>> extends true
    ? IsNever<Difference<Implemented, Expected>> extends true
      ? true
      : false
    : false;
};

/**
 * Assert that implemented commands match expected commands.
 * This type will cause a compile error if validation fails.
 */
export type AssertCommandsComplete<
  Expected extends string,
  Implemented extends string,
> = ValidateCommands<Expected, Implemented>["isValid"] extends true
  ? true
  : {
      error: "Command coverage mismatch";
      missing: ValidateCommands<Expected, Implemented>["missing"];
      extra: ValidateCommands<Expected, Implemented>["extra"];
    };
