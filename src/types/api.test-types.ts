/**
 * Type-level tests for API command coverage.
 *
 * These tests verify at compile time that:
 * 1. All OpenAPI operations have corresponding CLI commands
 * 2. No extra commands exist without spec operations
 *
 * If any test fails, this file won't compile - providing immediate feedback
 * when the spec changes or commands are added/removed.
 */

import type { ImplementedCommandName } from "../../generated/index.ts";
import type { ExpectedCommandName } from "../../generated/spec.ts";
import type { ValidateCommands, AssertCommandsComplete, Expect, Equal, IsNever } from "./api.ts";

// ============================================================================
// Test: Command coverage is complete
// ============================================================================

/**
 * This type validates that implemented commands match expected commands.
 * If validation fails, the types below will show what's missing or extra.
 */
type ValidationResult = ValidateCommands<ExpectedCommandName, ImplementedCommandName>;

/**
 * COMPILE-TIME ASSERTION: All API operations have commands.
 *
 * If this line errors, it means:
 * - Some API operations are missing CLI commands (check `missing`)
 * - Some CLI commands don't have API operations (check `extra`)
 *
 * To debug, hover over ValidationResult to see which commands are missing/extra.
 */
export type AssertComplete = Expect<
  AssertCommandsComplete<ExpectedCommandName, ImplementedCommandName> extends true ? true : false
>;

// ============================================================================
// Test: No missing commands
// ============================================================================

/**
 * Commands that exist in the spec but are not implemented.
 * This should be `never` if all commands are implemented.
 */
export type MissingCommands = ValidationResult["missing"];

/**
 * COMPILE-TIME ASSERTION: No commands are missing.
 * If this fails, hover over MissingCommands to see which ones are missing.
 */
export type AssertNoMissing = Expect<IsNever<MissingCommands>>;

// ============================================================================
// Test: No extra commands
// ============================================================================

/**
 * Commands that are implemented but don't exist in the spec.
 * This should be `never` if no extra commands exist.
 */
export type ExtraCommands = ValidationResult["extra"];

/**
 * COMPILE-TIME ASSERTION: No extra commands exist.
 * If this fails, hover over ExtraCommands to see which ones are extra.
 */
export type AssertNoExtra = Expect<IsNever<ExtraCommands>>;

// ============================================================================
// Test: Known command names exist
// ============================================================================

// Verify some key commands are in the expected set
export type TestListVehicles = Expect<
  Equal<"list-vehicles" extends ExpectedCommandName ? true : false, true>
>;
export type TestGetVehicle = Expect<
  Equal<"get-vehicle" extends ExpectedCommandName ? true : false, true>
>;
export type TestPublicTokenExchange = Expect<
  Equal<"public-token-exchange" extends ExpectedCommandName ? true : false, true>
>;
export type TestListDrivers = Expect<
  Equal<"list-drivers" extends ExpectedCommandName ? true : false, true>
>;

// Verify they're also implemented
export type TestListVehiclesImpl = Expect<
  Equal<"list-vehicles" extends ImplementedCommandName ? true : false, true>
>;
export type TestGetVehicleImpl = Expect<
  Equal<"get-vehicle" extends ImplementedCommandName ? true : false, true>
>;

// ============================================================================
// Test: Validation type structure
// ============================================================================

// Ensure ValidateCommands produces expected shape
export type TestValidationHasMissing = Expect<
  Equal<"missing" extends keyof ValidationResult ? true : false, true>
>;
export type TestValidationHasExtra = Expect<
  Equal<"extra" extends keyof ValidationResult ? true : false, true>
>;
export type TestValidationHasIsValid = Expect<
  Equal<"isValid" extends keyof ValidationResult ? true : false, true>
>;
