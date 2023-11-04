import {
  CodeBlockWriter
} from "ts-morph";

import {
  StringTypeStructureImpl,
  WriterTypeStructureImpl,
  type stringOrWriterFunction,
} from "#stage_two/snapshot/source/exports.js";

import {
  TypeStructureSet,
} from "#stage_two/snapshot/source/internal-exports.js";

describe("TypeStructureSet", () => {
  let backingArray: stringOrWriterFunction[];
  let writerSet: TypeStructureSet;
  beforeEach(() => {
    backingArray = [];
    writerSet = new TypeStructureSet(backingArray);
  });

  it("starts out empty", () => {
    expect(writerSet.size).toBe(0);
  })

  it("tracks strings as strings", () => {
    writerSet.add("boolean");
    expect(backingArray.includes("boolean")).toBe(true);
    expect(backingArray.length).toBe(1);

    expect(writerSet.size).toBe(1);
    expect(writerSet.has("boolean")).toBe(true);
    expect(Array.from(writerSet)).toEqual(["boolean"]);

    expect(writerSet.delete("boolean")).toBe(true);
    expect(writerSet.has("boolean")).toBe(false);
    expect(writerSet.size).toBe(0);
    expect(Array.from(writerSet)).toEqual([]);

    expect(writerSet.delete("boolean")).toBe(false);
    expect(writerSet.has("boolean")).toBe(false);
    expect(writerSet.size).toBe(0);
    expect(Array.from(writerSet)).toEqual([]);

    writerSet.add("object");
    writerSet.add("boolean");
    writerSet.add("void");
    writerSet.add("object");

    // preserving ordering test
    expect(Array.from(writerSet)).toEqual(["object", "boolean", "void"]);
    expect(backingArray).toEqual(["object", "boolean", "void"]);
  });

  it("tracks type structures as themselves", () => {
    const stringFoo = new StringTypeStructureImpl("foo");
    const stringBar = new StringTypeStructureImpl("bar");

    writerSet.add("boolean");
    writerSet.add(stringFoo);
    expect(backingArray).toEqual(["boolean", stringFoo.writerFunction]);
    expect(writerSet.has("boolean")).toBe(true);
    expect(writerSet.has(stringFoo)).toBe(true);
    expect(writerSet.size).toBe(2);

    writerSet.add(stringBar);
    expect(backingArray).toEqual([
      "boolean",
      stringFoo.writerFunction,
      stringBar.writerFunction,
    ]);
    expect(writerSet.has(stringBar)).toBe(true);
    expect(writerSet.size).toBe(3);
    expect(Array.from(writerSet)).toEqual([
      "boolean", stringFoo, stringBar
    ]);

    writerSet.delete(stringFoo);
    expect(writerSet.has(stringFoo)).toBe(false);
    expect(writerSet.size).toBe(2);
    expect(backingArray).toEqual([
      "boolean", stringBar.writerFunction
    ]);
    expect(Array.from(writerSet)).toEqual([
      "boolean", stringBar
    ]);

    writerSet.add(stringFoo);
    writerSet.delete(stringBar);
    expect(writerSet.has(stringBar)).toBe(false);
    expect(writerSet.size).toBe(2);
    expect(backingArray).toEqual([
      "boolean", stringFoo.writerFunction
    ]);
    expect(Array.from(writerSet)).toEqual([
      "boolean", stringFoo
    ]);
  });

  it("initializes with existing values", () => {
    let called = false;
    function writerOne(writer: CodeBlockWriter): void {
      called = true;
      void(writer);
    }
    const stringFoo = new StringTypeStructureImpl("foo");
    backingArray.push("boolean", writerOne, stringFoo.writerFunction);

    writerSet = new TypeStructureSet(backingArray);
    expect(writerSet.size).toBe(3);
    const writerArray = Array.from(writerSet);
    expect(writerArray[1]).toBeInstanceOf(WriterTypeStructureImpl);
    expect((writerArray[1] as WriterTypeStructureImpl).writerFunction).toBe(writerOne);

    writerArray.splice(1, 1);
    expect(writerArray).toEqual([
      "boolean", stringFoo
    ]);

    expect(backingArray).toEqual([
      "boolean", writerOne, stringFoo.writerFunction
    ]);
    expect(called).toBe(false);
  });

  it(".clear clears the backing array as well", () => {
    let called = false;
    function writerOne(writer: CodeBlockWriter): void {
      called = true;
      void(writer);
    }
    const stringFoo = new StringTypeStructureImpl("foo");
    backingArray.push("boolean", writerOne, stringFoo.writerFunction);

    writerSet = new TypeStructureSet(backingArray);

    writerSet.clear();
    expect(backingArray).toEqual([]);
    expect(writerSet.size).toBe(0);
    expect(Array.from(writerSet).length).toBe(0);
    expect(called).toBe(false);
  });
});
