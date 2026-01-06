/**
 * OpenAPI to CLI Generator
 *
 * This script fetches the Terminal OpenAPI spec and generates CLI commands
 * dynamically from it.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const OPENAPI_URL = "https://api.withterminal.com/tsp/openapi";
const GENERATED_DIR = join(import.meta.dir, "..", "generated");

interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
  };
  servers: Array<{ url: string; description: string }>;
  paths: Record<string, PathItem>;
  components: {
    schemas: Record<string, Schema>;
    parameters: Record<string, Parameter>;
    responses: Record<string, Response>;
  };
  tags: Array<{ name: string; description?: string }>;
}

interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  patch?: Operation;
  delete?: Operation;
  parameters?: Parameter[];
}

interface Operation {
  summary: string;
  description?: string;
  operationId: string;
  tags?: string[];
  parameters?: Array<Parameter | { $ref: string }>;
  requestBody?: {
    content: {
      "application/json": {
        schema: Schema;
      };
    };
  };
  responses: Record<string, Response>;
}

interface Parameter {
  name: string;
  in: "path" | "query" | "header";
  required?: boolean;
  schema?: Schema;
  description?: string;
}

interface Schema {
  type?: string;
  properties?: Record<string, Schema>;
  items?: Schema;
  $ref?: string;
  enum?: string[];
  required?: string[];
  description?: string;
}

interface Response {
  description: string;
  content?: {
    "application/json": {
      schema: Schema;
    };
  };
}

interface CommandDef {
  name: string;
  description: string;
  operationId: string;
  method: string;
  path: string;
  pathParams: ParamDef[];
  queryParams: ParamDef[];
  bodyParams: ParamDef[];
  requiresConnectionToken: boolean;
  tag: string;
  responseSchema: unknown;
}

interface ParamDef {
  name: string;
  type: string;
  required: boolean;
  description: string;
  enumValues?: string[];
}

async function fetchOpenAPISpec(): Promise<OpenAPISpec> {
  console.log("Fetching OpenAPI spec from", OPENAPI_URL);
  const response = await fetch(OPENAPI_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI spec: ${response.status}`);
  }
  return (await response.json()) as OpenAPISpec;
}

function resolveRef(spec: OpenAPISpec, ref: string): unknown {
  // Handle $ref like "#/components/parameters/ConnectionToken"
  const parts = ref.replace("#/", "").split("/");
  let current: unknown = spec;
  for (const part of parts) {
    current = (current as Record<string, unknown>)[part];
    if (!current) {
      return null;
    }
  }
  return current;
}

function resolveParameter(
  spec: OpenAPISpec,
  param: Parameter | { $ref: string },
): Parameter | null {
  if ("$ref" in param) {
    return resolveRef(spec, param.$ref) as Parameter | null;
  }
  return param;
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function getSchemaType(schema: Schema | undefined): string {
  if (!schema) return "string";
  if (schema.type === "integer" || schema.type === "number") return "number";
  if (schema.type === "boolean") return "boolean";
  if (schema.type === "array") return "array";
  if (schema.type === "object") return "object";
  return "string";
}

function extractBodyParams(spec: OpenAPISpec, requestBody: Operation["requestBody"]): ParamDef[] {
  if (!requestBody?.content?.["application/json"]?.schema) {
    return [];
  }

  const schema = requestBody.content["application/json"].schema;
  let resolvedSchema = schema;

  if (schema.$ref) {
    resolvedSchema = resolveRef(spec, schema.$ref) as Schema;
  }

  if (!resolvedSchema?.properties) {
    return [];
  }

  const required = resolvedSchema.required ?? [];

  return Object.entries(resolvedSchema.properties).map(([name, propSchema]) => {
    let resolved = propSchema;
    if (propSchema.$ref) {
      resolved = resolveRef(spec, propSchema.$ref) as Schema;
    }
    return {
      name,
      type: getSchemaType(resolved),
      required: required.includes(name),
      description: resolved?.description ?? "",
      enumValues: resolved?.enum,
    };
  });
}

function resolveSchemaRefs(
  spec: OpenAPISpec,
  schema: unknown,
  visited = new Set<string>(),
): unknown {
  if (!schema || typeof schema !== "object") {
    return schema;
  }

  const obj = schema as Record<string, unknown>;

  // Handle $ref
  if (obj.$ref && typeof obj.$ref === "string") {
    // Prevent infinite recursion
    if (visited.has(obj.$ref)) {
      return { $ref: obj.$ref };
    }
    visited.add(obj.$ref);
    const resolved = resolveRef(spec, obj.$ref);
    return resolveSchemaRefs(spec, resolved, visited);
  }

  // Recursively resolve all properties
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      result[key] = value.map((item) => resolveSchemaRefs(spec, item, new Set(visited)));
    } else if (typeof value === "object" && value !== null) {
      result[key] = resolveSchemaRefs(spec, value, new Set(visited));
    } else {
      result[key] = value;
    }
  }
  return result;
}

function extractResponseSchema(spec: OpenAPISpec, responses: Operation["responses"]): unknown {
  // Get the 200 response schema
  const successResponse = responses["200"];
  if (!successResponse) {
    return null;
  }

  const content = successResponse.content?.["application/json"];
  if (!content?.schema) {
    return null;
  }

  // Resolve all $refs in the schema
  return resolveSchemaRefs(spec, content.schema);
}

function parseOperations(spec: OpenAPISpec): CommandDef[] {
  const commands: CommandDef[] = [];

  for (const [path, pathItem] of Object.entries(spec.paths)) {
    const pathLevelParams = pathItem.parameters ?? [];

    const methods = ["get", "post", "put", "patch", "delete"] as const;
    for (const method of methods) {
      const operation = pathItem[method];
      if (!operation) continue;

      const allParams = [
        ...pathLevelParams.map((p) => resolveParameter(spec, p)),
        ...(operation.parameters ?? []).map((p) => resolveParameter(spec, p)),
      ].filter((p): p is Parameter => p !== null);

      const pathParams: ParamDef[] = [];
      const queryParams: ParamDef[] = [];
      let requiresConnectionToken = false;

      for (const param of allParams) {
        if (param.name === "Connection-Token") {
          requiresConnectionToken = true;
          continue;
        }

        const paramDef: ParamDef = {
          name: param.name,
          type: getSchemaType(param.schema),
          required: param.required ?? false,
          description: param.description ?? "",
          enumValues: param.schema?.enum,
        };

        if (param.in === "path") {
          pathParams.push(paramDef);
        } else if (param.in === "query") {
          queryParams.push(paramDef);
        }
      }

      const bodyParams = extractBodyParams(spec, operation.requestBody);

      // Generate command name from operationId or path
      let commandName = operation.operationId ?? `${method}-${path}`;
      commandName = toKebabCase(commandName);

      // Get tag
      const tag = operation.tags?.[0] ?? "other";

      // Extract response schema
      const responseSchema = extractResponseSchema(spec, operation.responses);

      commands.push({
        name: commandName,
        description: operation.summary ?? operation.description ?? "",
        operationId: operation.operationId ?? "",
        method: method.toUpperCase(),
        path,
        pathParams,
        queryParams,
        bodyParams,
        requiresConnectionToken,
        tag,
        responseSchema,
      });
    }
  }

  return commands;
}

function groupByTag(commands: CommandDef[]): Map<string, CommandDef[]> {
  const groups = new Map<string, CommandDef[]>();

  for (const cmd of commands) {
    const tag = toKebabCase(cmd.tag);
    if (!groups.has(tag)) {
      groups.set(tag, []);
    }
    groups.get(tag)!.push(cmd);
  }

  return groups;
}

function generateCommandCode(cmd: CommandDef): string {
  const funcName = toCamelCase(cmd.name.replace(/-/g, "_"));
  const hasArgs =
    cmd.pathParams.length > 0 || cmd.queryParams.length > 0 || cmd.bodyParams.length > 0;
  const argsParam = hasArgs ? "args" : "_args";

  // Generate path with parameter substitution (cast to string to satisfy template expression type checking)
  let pathCode = `"${cmd.path}"`;
  for (const param of cmd.pathParams) {
    pathCode = pathCode.replace(`{${param.name}}`, `\${String(args["${param.name}"])}`);
  }
  if (cmd.pathParams.length > 0) {
    pathCode = "`" + pathCode.slice(1, -1) + "`";
  }

  // Generate query params code
  const queryCode =
    cmd.queryParams.length > 0
      ? `{
      ${cmd.queryParams.map((p) => `"${p.name}": args["${p.name}"] as string | number | boolean | undefined`).join(",\n      ")}
    }`
      : "undefined";

  // Generate body code
  const bodyCode =
    cmd.bodyParams.length > 0
      ? `{
      ${cmd.bodyParams.map((p) => `"${p.name}": args["${p.name}"]`).join(",\n      ")}
    }`
      : "undefined";

  // Determine client method
  const methodLower = cmd.method.toLowerCase();
  let clientCall: string;

  if (methodLower === "get" || methodLower === "delete") {
    clientCall = `await client.${methodLower}(${pathCode}, ${queryCode}, ${cmd.requiresConnectionToken})`;
  } else {
    clientCall = `await client.${methodLower}(${pathCode}, ${bodyCode}, ${queryCode}, ${cmd.requiresConnectionToken})`;
  }

  return `
export async function ${funcName}(client: TerminalClient, ${argsParam}: Record<string, unknown>): Promise<unknown> {
  return ${clientCall};
}`;
}

function generateCommandDef(cmd: CommandDef): string {
  const allParams = [...cmd.pathParams, ...cmd.queryParams, ...cmd.bodyParams];

  const argsCode = allParams
    .map((p) => {
      let argDef = `{
      name: "${p.name}",
      type: "${p.type}",
      required: ${p.required},
      description: "${p.description.replace(/"/g, '\\"').replace(/\n/g, " ")}"`;
      if (p.enumValues) {
        argDef += `,
      enum: ${JSON.stringify(p.enumValues)}`;
      }
      argDef += `
    }`;
      return argDef;
    })
    .join(",\n    ");

  return `{
    name: "${cmd.name}",
    description: "${cmd.description.replace(/"/g, '\\"').replace(/\n/g, " ")}",
    method: "${cmd.method}",
    path: "${cmd.path}",
    requiresConnectionToken: ${cmd.requiresConnectionToken},
    args: [
    ${argsCode}
    ],
    handler: ${toCamelCase(cmd.name.replace(/-/g, "_"))},
    responseSchema: ${JSON.stringify(cmd.responseSchema)}
  }`;
}

function generateTagModule(tag: string, commands: CommandDef[]): string {
  return `// AUTO-GENERATED FILE - DO NOT EDIT
// Generated from OpenAPI spec

import type { TerminalClient } from "../src/lib/client.ts";

export interface CommandArg {
  name: string;
  type: string;
  required: boolean;
  description: string;
  enum?: string[];
}

export interface Command {
  name: string;
  description: string;
  method: string;
  path: string;
  requiresConnectionToken: boolean;
  args: CommandArg[];
  handler: (client: TerminalClient, args: Record<string, unknown>) => Promise<unknown>;
  responseSchema: unknown;
}

// Command handlers
${commands.map(generateCommandCode).join("\n")}

// Command definitions
export const commands: Command[] = [
  ${commands.map(generateCommandDef).join(",\n  ")}
];

export const tagName = "${tag}";
export const tagDescription = "${commands[0]?.tag ?? tag}";
`;
}

function generateIndexFile(tags: string[], allCommandNames: string[]): string {
  const imports = tags.map((t) => `import * as ${toCamelCase(t)} from "./${t}.ts";`).join("\n");

  const commandsExport = tags.map((t) => `...${toCamelCase(t)}.commands`).join(",\n  ");

  const tagsExport = tags
    .map(
      (t) => `{
    name: "${t}",
    description: ${toCamelCase(t)}.tagDescription,
    commands: ${toCamelCase(t)}.commands
  }`,
    )
    .join(",\n  ");

  // Generate const array of command names for type checking
  const commandNamesConst = allCommandNames.map((n) => `"${n}"`).join(",\n  ");

  return `// AUTO-GENERATED FILE - DO NOT EDIT
// Generated from OpenAPI spec

${imports}

export type { Command, CommandArg } from "./${tags[0]}.ts";

export const allCommands = [
  ${commandsExport}
];

export const commandGroups = [
  ${tagsExport}
];

/**
 * All command names as a const tuple for type-level validation.
 * This enables compile-time checking that all API operations have commands.
 */
export const commandNames = [
  ${commandNamesConst}
] as const;

/** Type representing all implemented command names */
export type ImplementedCommandName = (typeof commandNames)[number];

export function findCommand(name: string) {
  return allCommands.find(cmd => cmd.name === name);
}

export function findCommandsByTag(tag: string) {
  const group = commandGroups.find(g => g.name === tag);
  return group?.commands ?? [];
}
`;
}

/**
 * Generate spec.ts file that extracts operationIds and their expected command names.
 * This serves as the source of truth from the OpenAPI spec.
 */
function generateSpecFile(commands: CommandDef[]): string {
  const operationIds = commands
    .map((c) => c.operationId)
    .filter(Boolean)
    .sort();
  const commandNames = commands.map((c) => c.name).sort();

  return `// AUTO-GENERATED FILE - DO NOT EDIT
// Generated from OpenAPI spec - this is the source of truth for API coverage

/**
 * All operation IDs from the OpenAPI spec.
 * This is automatically generated and represents what endpoints exist in the API.
 */
export const specOperationIds = [
  ${operationIds.map((id) => `"${id}"`).join(",\n  ")}
] as const;

/** Type union of all operation IDs from the spec */
export type SpecOperationId = (typeof specOperationIds)[number];

/**
 * Expected command names derived from the OpenAPI spec.
 * Each operationId maps to a kebab-case command name.
 * 
 * This is the source of truth for what CLI commands should exist.
 */
export const expectedCommandNames = [
  ${commandNames.map((n) => `"${n}"`).join(",\n  ")}
] as const;

/** Type union of all expected command names */
export type ExpectedCommandName = (typeof expectedCommandNames)[number];
`;
}

async function main() {
  try {
    // Fetch spec
    const spec = await fetchOpenAPISpec();

    // Parse operations
    const commands = parseOperations(spec);
    console.log(`Parsed ${commands.length} commands`);

    // Group by tag
    const grouped = groupByTag(commands);
    console.log(`Found ${grouped.size} command groups`);

    // Create output directory
    if (!existsSync(GENERATED_DIR)) {
      mkdirSync(GENERATED_DIR, { recursive: true });
    }

    // Generate files for each tag
    const tags: string[] = [];
    for (const [tag, cmds] of grouped) {
      const code = generateTagModule(tag, cmds);
      const filePath = join(GENERATED_DIR, `${tag}.ts`);
      writeFileSync(filePath, code);
      console.log(`Generated ${filePath} with ${cmds.length} commands`);
      tags.push(tag);
    }

    // Generate index file
    tags.sort();
    const allCommandNames = commands.map((c) => c.name).sort();
    const indexCode = generateIndexFile(tags, allCommandNames);
    writeFileSync(join(GENERATED_DIR, "index.ts"), indexCode);
    console.log(`Generated index.ts`);

    // Generate spec.ts with operationIds and expected command names
    const specCode = generateSpecFile(commands);
    writeFileSync(join(GENERATED_DIR, "spec.ts"), specCode);
    console.log(`Generated spec.ts`);

    // Save spec for reference
    writeFileSync(join(GENERATED_DIR, "openapi.json"), JSON.stringify(spec, null, 2));
    console.log(`Saved OpenAPI spec to openapi.json`);

    console.log("\nGeneration complete!");
  } catch (error) {
    console.error("Generation failed:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Generation failed:", error);
  process.exit(1);
});
