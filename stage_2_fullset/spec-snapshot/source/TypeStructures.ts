import {
  CodeBlockWriter,
} from "ts-morph";

import {
  LiteralTypeStructureImpl,
  ParenthesesTypeStructureImpl,
  StringTypeStructureImpl,
  TypeStructureKind,
  WriterTypeStructureImpl,
} from "#stage_two/snapshot/source/exports.js";

describe("TypeStructure for ts-morph: ", () => {
  let writer: CodeBlockWriter;
  beforeEach(() => writer = new CodeBlockWriter());

  const fooTyped = new LiteralTypeStructureImpl("foo");
  const nstTyped = new LiteralTypeStructureImpl("NumberStringType");
  void(nstTyped);

  const stringBarTyped = new StringTypeStructureImpl("bar");

  it("LiteralTypedStructureImpl", () => {
    fooTyped.writerFunction(writer);
    expect<string>(writer.toString()).toBe("foo");
    expect(fooTyped.kind).toBe(TypeStructureKind.Literal);
  });

  it("WriterTypedStructureImpl", () => {
    const typedWriter = new WriterTypeStructureImpl(
      (writer: CodeBlockWriter) => writer.write("hi mom")
    );

    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`hi mom`);
    expect(typedWriter.kind).toBe(TypeStructureKind.Writer);
  });

  it("StringTypedStructureImpl", () => {
    stringBarTyped.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`"bar"`);
    expect(stringBarTyped.kind).toBe(TypeStructureKind.String);
  });

  it("ParenthesesTypedStructureImpl", () => {
    const typedWriter = new ParenthesesTypeStructureImpl("true");
    typedWriter.writerFunction(writer);

    expect<string>(writer.toString()).toBe("(true)");
    expect(typedWriter.kind).toBe(TypeStructureKind.Parentheses);

    // mutability test for the child type
    writer = new CodeBlockWriter();
    typedWriter.childTypes[0] = "false";
    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe("(false)");

    // mutability test: if someone puts in too many child types...
    writer = new CodeBlockWriter();
    typedWriter.childTypes.push("unknown")
    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe("(false)");
  });
});
