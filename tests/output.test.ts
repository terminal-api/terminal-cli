import { describe, test, expect } from "bun:test";
import { formatOutput, type OutputFormat } from "../src/lib/output";

describe("output formatting", () => {
  describe("formatOutput with json format", () => {
    test("formats simple object as JSON", () => {
      const data = { name: "test", value: 123 };
      const result = formatOutput(data, { format: "json" });
      expect(result).toBe(JSON.stringify(data, null, 2));
    });

    test("formats array as JSON", () => {
      const data = [1, 2, 3];
      const result = formatOutput(data, { format: "json" });
      expect(result).toBe(JSON.stringify(data, null, 2));
    });

    test("formats nested object as JSON", () => {
      const data = { outer: { inner: { deep: "value" } } };
      const result = formatOutput(data, { format: "json" });
      expect(result).toBe(JSON.stringify(data, null, 2));
    });

    test("formats null as JSON", () => {
      const result = formatOutput(null, { format: "json" });
      expect(result).toBe("null");
    });
  });

  describe("formatOutput with pretty format", () => {
    test("formats null value", () => {
      const result = formatOutput(null, { format: "pretty" });
      expect(result).toContain("null");
    });

    test("formats undefined value", () => {
      const result = formatOutput(undefined, { format: "pretty" });
      expect(result).toContain("null");
    });

    test("formats string value with quotes", () => {
      const result = formatOutput("hello", { format: "pretty" });
      expect(result).toContain('"hello"');
    });

    test("formats number value", () => {
      const result = formatOutput(42, { format: "pretty" });
      expect(result).toContain("42");
    });

    test("formats boolean value", () => {
      const result = formatOutput(true, { format: "pretty" });
      expect(result).toContain("true");
    });

    test("formats empty array", () => {
      const result = formatOutput([], { format: "pretty" });
      expect(result).toBe("[]");
    });

    test("formats empty object", () => {
      const result = formatOutput({}, { format: "pretty" });
      expect(result).toBe("{}");
    });

    test("formats object with keys", () => {
      const result = formatOutput({ name: "test" }, { format: "pretty" });
      expect(result).toContain("name");
      expect(result).toContain("test");
    });

    test("formats nested objects with indentation", () => {
      const data = { outer: { inner: "value" } };
      const result = formatOutput(data, { format: "pretty" });
      expect(result).toContain("outer");
      expect(result).toContain("inner");
      expect(result).toContain("value");
    });

    test("formats array with items", () => {
      const data = ["a", "b", "c"];
      const result = formatOutput(data, { format: "pretty" });
      expect(result).toContain('"a"');
      expect(result).toContain('"b"');
      expect(result).toContain('"c"');
    });
  });

  describe("formatOutput with table format", () => {
    test("formats paginated results as table", () => {
      const data = {
        results: [
          { id: "1", name: "Item 1" },
          { id: "2", name: "Item 2" },
        ],
      };
      const result = formatOutput(data, { format: "table" });
      expect(result).toContain("ID");
      expect(result).toContain("NAME");
      expect(result).toContain("1");
      expect(result).toContain("Item 1");
      expect(result).toContain("2");
      expect(result).toContain("Item 2");
    });

    test("formats empty results", () => {
      const data = { results: [] };
      const result = formatOutput(data, { format: "table" });
      expect(result).toBe("No results");
    });

    test("formats plain array as table", () => {
      const data = [
        { id: "a", value: 100 },
        { id: "b", value: 200 },
      ];
      const result = formatOutput(data, { format: "table" });
      expect(result).toContain("ID");
      expect(result).toContain("VALUE");
      expect(result).toContain("a");
      expect(result).toContain("100");
    });

    test("formats single object as key-value pairs", () => {
      const data = { id: "123", name: "Test Item", status: "active" };
      const result = formatOutput(data, { format: "table" });
      expect(result).toContain("id");
      expect(result).toContain("123");
      expect(result).toContain("name");
      expect(result).toContain("Test Item");
    });

    test("flattens nested objects in table", () => {
      const data = {
        results: [{ id: "1", metadata: { category: "test", priority: "high" } }],
      };
      const result = formatOutput(data, { format: "table" });
      expect(result).toContain("METADATA.CATEGORY");
      expect(result).toContain("METADATA.PRIORITY");
      expect(result).toContain("test");
      expect(result).toContain("high");
    });

    test("handles arrays in cells", () => {
      const data = {
        results: [{ id: "1", tags: ["a", "b", "c"] }],
      };
      const result = formatOutput(data, { format: "table" });
      expect(result).toContain("[3 items]");
    });

    test("handles nested objects in cells", () => {
      const data = [{ id: "1", config: { nested: { deep: "value" } } }];
      const result = formatOutput(data, { format: "table" });
      // The nested object should be flattened
      expect(result).toContain("CONFIG.NESTED.DEEP");
    });

    test("truncates long values", () => {
      const longValue = "a".repeat(100);
      const data = { results: [{ id: "1", description: longValue }] };
      const result = formatOutput(data, { format: "table" });
      expect(result).toContain("...");
      expect(result.length).toBeLessThan(longValue.length * 2);
    });

    test("formats primitive value as string", () => {
      const result = formatOutput("just a string", { format: "table" });
      expect(result).toBe("just a string");
    });
  });

  describe("format fallback", () => {
    test("unknown format falls back to JSON", () => {
      const data = { test: true };
      const result = formatOutput(data, { format: "unknown" as OutputFormat });
      expect(result).toBe(JSON.stringify(data, null, 2));
    });
  });
});
