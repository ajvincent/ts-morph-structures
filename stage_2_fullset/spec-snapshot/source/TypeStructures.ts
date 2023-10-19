import {
  CodeBlockWriter,
} from "ts-morph";

import {
  IndexedAccessTypeStructureImpl,
  IntersectionTypeStructureImpl,
  LiteralTypeStructureImpl,
  ParenthesesTypeStructureImpl,
  StringTypeStructureImpl,
  TupleTypeStructureImpl,
  TypeStructureKind,
  UnionTypeStructureImpl,
  WriterTypeStructureImpl,
} from "#stage_two/snapshot/source/exports.js";

import {
  TypeStructureClassesMap
} from "#stage_two/snapshot/source/internal-exports.js";

describe("TypeStructure for ts-morph (stage 2): ", () => {
  let writer: CodeBlockWriter;
  beforeEach(() => writer = new CodeBlockWriter());

  const fooTyped = new LiteralTypeStructureImpl("foo");
  const nstTyped = new LiteralTypeStructureImpl("NumberStringType");
  void(nstTyped);

  const stringBarTyped = new StringTypeStructureImpl("bar");

  it("LiteralTypeStructureImpl", () => {
    fooTyped.writerFunction(writer);
    expect<string>(writer.toString()).toBe("foo");
    expect(fooTyped.kind).toBe(TypeStructureKind.Literal);
  });

  it("WriterTypeStructureImpl", () => {
    const typedWriter = new WriterTypeStructureImpl(
      (writer: CodeBlockWriter) => writer.write("hi mom")
    );

    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`hi mom`);
    expect(typedWriter.kind).toBe(TypeStructureKind.Writer);
  });

  it("StringTypeStructureImpl", () => {
    stringBarTyped.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`"bar"`);
    expect(stringBarTyped.kind).toBe(TypeStructureKind.String);
  });

  it("ParenthesesTypeStructureImpl", () => {
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

  it("IndexedAccessTypeStructureImpl", () => {
    const typedWriter = new IndexedAccessTypeStructureImpl(fooTyped, stringBarTyped);
    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`foo["bar"]`);

    expect(typedWriter.kind).toBe(TypeStructureKind.IndexedAccess);
  });

  it("UnionTypeStructureImpl", () => {
    const typedWriter = new UnionTypeStructureImpl([fooTyped, nstTyped]);
    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`foo | NumberStringType`);
    expect(typedWriter.kind).toBe(TypeStructureKind.Union);
  });

  it("IntersectionTypeStructureImpl", () => {
    const typedWriter = new IntersectionTypeStructureImpl;
    typedWriter.childTypes.push(fooTyped);
    typedWriter.childTypes.push(nstTyped);

    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`foo & NumberStringType`);
    expect(typedWriter.kind).toBe(TypeStructureKind.Intersection);
  });

  it("TupleTypedStructureImpl", () => {
    const typedWriter = new TupleTypeStructureImpl([fooTyped, nstTyped]);

    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`[foo, NumberStringType]`);
    expect(typedWriter.kind).toBe(TypeStructureKind.Tuple);
  });

  xit("TypeStructureClassesMap is complete", () => {
    const kinds = Object.values(TypeStructureKind).filter(
      value => typeof value === "number"
    ) as TypeStructureKind[];
    for (const kind of kinds) {
      const _class = TypeStructureClassesMap.get(kind);
      expect(_class).withContext(TypeStructureKind[kind]).toBeTruthy();
      if (_class) {
        expect(_class.prototype.kind as TypeStructureKind).withContext(TypeStructureKind[kind]).toBe(kind);
      }
    }
  });

  xit("Each test covers a .clone() method", () => {
    expect(true).toBe(false);
  });

  xit("Each test covers a registerCallback case", () => {
    expect(true).toBe(false);
  });
});
