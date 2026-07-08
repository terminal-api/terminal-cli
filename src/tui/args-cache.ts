import type { Command, CommandArg } from "../../generated/index.ts";

export type ArgsCache = Map<string, Record<string, unknown>>;

/** Args that are one-shot tokens and must not be reused across runs. */
const UNCACHEABLE_ARG_NAMES = new Set(["cursor"]);

export function createArgsCache(): ArgsCache {
  return new Map();
}

function scopedCacheKey(scopeKey: string, commandName: string): string {
  return `${scopeKey}\0${commandName}`;
}

/** Scope key for the active connection token (empty when none is configured). */
export function getConnectionScopeKey(connectionToken?: string): string {
  return connectionToken ?? "";
}

/** Connection-scoped commands use the token; account-level commands use global scope. */
export function resolveArgsCacheScopeKey(cmd: Command, connectionScopeKey: string): string {
  return cmd.requiresConnectionToken ? connectionScopeKey : "";
}

function isCacheableArg(arg: CommandArg): boolean {
  return !UNCACHEABLE_ARG_NAMES.has(arg.name);
}

function isValidCachedValue(arg: CommandArg, value: unknown): boolean {
  if (value === undefined || value === null) {
    return false;
  }

  if (arg.enum && arg.enum.length > 0) {
    const asString =
      typeof value === "string" || typeof value === "number" || typeof value === "boolean"
        ? String(value)
        : null;
    return asString !== null && arg.enum.includes(asString);
  }

  if (arg.type === "number") {
    return typeof value === "number" && !Number.isNaN(value);
  }

  if (arg.type === "boolean") {
    return typeof value === "boolean";
  }

  if (arg.type === "array") {
    return Array.isArray(value);
  }

  if (arg.type === "object") {
    return typeof value === "object" && !Array.isArray(value);
  }

  return true;
}

export function getCachedArgs(
  cache: ArgsCache,
  connectionScopeKey: string,
  cmd: Command,
): Record<string, unknown> {
  const scopeKey = resolveArgsCacheScopeKey(cmd, connectionScopeKey);
  const stored = cache.get(scopedCacheKey(scopeKey, cmd.name));
  if (!stored) {
    return {};
  }

  const argByName = new Map(cmd.args.map((arg) => [arg.name, arg]));
  const restored: Record<string, unknown> = {};

  for (const [name, value] of Object.entries(stored)) {
    const arg = argByName.get(name);
    if (!arg || !isCacheableArg(arg) || !isValidCachedValue(arg, value)) {
      continue;
    }
    restored[name] = value;
  }

  return restored;
}

export function saveArgsToCache(
  cache: ArgsCache,
  connectionScopeKey: string,
  cmd: Command,
  collectedArgs: Record<string, unknown>,
): void {
  const cacheableNames = new Set(cmd.args.filter(isCacheableArg).map((arg) => arg.name));

  const toStore: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(collectedArgs)) {
    if (!cacheableNames.has(name)) {
      continue;
    }
    toStore[name] = value;
  }

  const scopeKey = resolveArgsCacheScopeKey(cmd, connectionScopeKey);
  const key = scopedCacheKey(scopeKey, cmd.name);

  if (Object.keys(toStore).length === 0) {
    cache.delete(key);
    return;
  }

  cache.set(key, toStore);
}

export function clearCachedArgs(cache: ArgsCache, connectionScopeKey: string, cmd: Command): void {
  const scopeKey = resolveArgsCacheScopeKey(cmd, connectionScopeKey);
  cache.delete(scopedCacheKey(scopeKey, cmd.name));
}

export function hasCachedArgs(cache: ArgsCache, connectionScopeKey: string, cmd: Command): boolean {
  const scopeKey = resolveArgsCacheScopeKey(cmd, connectionScopeKey);
  return cache.has(scopedCacheKey(scopeKey, cmd.name));
}

export function getEditableArgs(cmd: Command): CommandArg[] {
  return cmd.args;
}
