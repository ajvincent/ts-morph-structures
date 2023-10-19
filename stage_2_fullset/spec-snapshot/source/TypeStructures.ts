import {
  CodeBlockWriter,
} from "ts-morph";

import {
  ArrayTypeStructureImpl,
  IndexedAccessTypeStructureImpl,
  IntersectionTypeStructureImpl,
  LiteralTypeStructureImpl,
  ParenthesesTypeStructureImpl,
  PrefixOperatorsTypeStructureImpl,
  QualifiedNameTypeStructureImpl,
  StringTypeStructureImpl,
  TupleTypeStructureImpl,
  TypeArgumentedTypeStructureImpl,
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

  const stringBarTyped = new StringTypeStructureImpl("bar");

  it("ArrayTypedStructureImpl", () => {
    const typedWriter = new ArrayTypeStructureImpl(fooTyped);
    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe("foo[]");

    expect(typedWriter.kind).toBe(TypeStructureKind.Array);
  });

  it("IndexedAccessTypeStructureImpl", () => {
    const typedWriter = new IndexedAccessTypeStructureImpl(fooTyped, stringBarTyped);
    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`foo["bar"]`);

    expect(typedWriter.kind).toBe(TypeStructureKind.IndexedAccess);
  });

  it("IntersectionTypeStructureImpl", () => {
    const typedWriter = new IntersectionTypeStructureImpl;
    typedWriter.childTypes.push(fooTyped);
    typedWriter.childTypes.push(nstTyped);

    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`foo & NumberStringType`);
    expect(typedWriter.kind).toBe(TypeStructureKind.Intersection);
  });

  it("LiteralTypeStructureImpl", () => {
    fooTyped.writerFunction(writer);
    expect<string>(writer.toString()).toBe("foo");
    expect(fooTyped.kind).toBe(TypeStructureKind.Literal);
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

  it("PrefixOperatorsTypeStructureImpl", () => {
    const typedWriter = new PrefixOperatorsTypeStructureImpl(
      ["typeof", "readonly"],
      new LiteralTypeStructureImpl("NumberStringType")
    );
    typedWriter.writerFunction(writer);

    expect<string>(writer.toString()).toBe("typeof readonly NumberStringType");
    expect(typedWriter.kind).toBe(TypeStructureKind.PrefixOperators);
  });

  it("QualifiedNameTypeStructureImpl", () => {
    const typedWriter = new QualifiedNameTypeStructureImpl([
      nstTyped.stringValue,
      fooTyped.stringValue
    ]);
    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`NumberStringType.foo`);
    expect(typedWriter.kind).toBe(TypeStructureKind.QualifiedName);
  });

  it("StringTypeStructureImpl", () => {
    stringBarTyped.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`"bar"`);
    expect(stringBarTyped.kind).toBe(TypeStructureKind.String);
  });

  it("TupleTypeStructureImpl", () => {
    const typedWriter = new TupleTypeStructureImpl([fooTyped, nstTyped]);

    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`[foo, NumberStringType]`);
    expect(typedWriter.kind).toBe(TypeStructureKind.Tuple);
  });

  it("TypeArgumentedTypeStructureImpl", () => {
    const typedWriter = new TypeArgumentedTypeStructureImpl(fooTyped);
    typedWriter.childTypes.push(stringBarTyped, nstTyped);
    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`foo<"bar", NumberStringType>`);

    expect(typedWriter.kind).toBe(TypeStructureKind.TypeArgumented);
  });

  it("UnionTypeStructureImpl", () => {
    const typedWriter = new UnionTypeStructureImpl([fooTyped, nstTyped]);
    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`foo | NumberStringType`);
    expect(typedWriter.kind).toBe(TypeStructureKind.Union);
  });

  it("WriterTypeStructureImpl", () => {
    const typedWriter = new WriterTypeStructureImpl(
      (writer: CodeBlockWriter) => writer.write("hi mom")
    );

    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`hi mom`);
    expect(typedWriter.kind).toBe(TypeStructureKind.Writer);
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
