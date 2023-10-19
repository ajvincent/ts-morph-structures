import {
  CodeBlockWriter,
} from "ts-morph";

import {
  ArrayTypeStructureImpl,
  ConditionalTypeStructureImpl,
  type ConditionalTypeStructureParts,
  IndexedAccessTypeStructureImpl,
  IntersectionTypeStructureImpl,
  LiteralTypeStructureImpl,
  ParameterTypeStructureImpl,
  ParenthesesTypeStructureImpl,
  PrefixOperatorsTypeStructureImpl,
  type PrefixUnaryOperator,
  QualifiedNameTypeStructureImpl,
  StringTypeStructureImpl,
  TemplateLiteralTypeStructureImpl,
  TupleTypeStructureImpl,
  TypeArgumentedTypeStructureImpl,
  TypeStructureKind,
  UnionTypeStructureImpl,
  WriterTypeStructureImpl,
} from "#stage_two/snapshot/source/exports.js";

import {
  MemberedObjectTypeStructureImpl,
  MethodSignatureImpl,
  ParameterDeclarationImpl,
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

  it("ConditionalTypedStructureImpl", () => {
    const checkType = new LiteralTypeStructureImpl("true");
    const extendsType = "ReturnsModified";
    const trueType = new LiteralTypeStructureImpl("BaseClassType");
    const falseType = "void";

    const parts: ConditionalTypeStructureParts = {
      checkType,
      extendsType,
      trueType,
      falseType,
    };

    const typedWriter = new ConditionalTypeStructureImpl(parts);

    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(
      "true extends ReturnsModified ? BaseClassType : void"
    );

    expect(typedWriter.kind).toBe(TypeStructureKind.Conditional);
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

  it("MemberedObjectTypeStructureImpl", () => {
    const typedWriter = new MemberedObjectTypeStructureImpl;

    const fooMethod = new MethodSignatureImpl("foo");
    typedWriter.methods.push(fooMethod);

    const param = new ParameterDeclarationImpl("firstArg");
    fooMethod.parameters.push(param);
    param.type = "string";

    fooMethod.returnType = "void";
    //fooMethod.returnTypeStructure = new LiteralTypedStructureImpl("void");

    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe(`{\n    foo(firstArg: string): void;\n}`);

    expect(typedWriter.kind).toBe(TypeStructureKind.MemberedObject);
  });

  it("ParameterTypeStructureImpl", () => {
    const typedWriter = new ParameterTypeStructureImpl("nst", undefined);
    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe("nst");
    expect(typedWriter.kind).toBe(TypeStructureKind.Parameter);

    writer = new CodeBlockWriter();
    typedWriter.typeStructure = nstTyped;
    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe("nst: NumberStringType");
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
    const prefixes: readonly PrefixUnaryOperator[] = ["typeof", "readonly"];
    const typedWriter = new PrefixOperatorsTypeStructureImpl(
      prefixes,
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

  it("TemplateLiteralTypeStructureImpl", () => {
    const AB = new UnionTypeStructureImpl;
    AB.childTypes = [new StringTypeStructureImpl("A"), new StringTypeStructureImpl("B")];

    const CD = new UnionTypeStructureImpl;
    CD.childTypes = [new StringTypeStructureImpl("C"), new StringTypeStructureImpl("D")];

    const typedWriter = new TemplateLiteralTypeStructureImpl(
      "one", [[AB, "two"], [CD, "three"]]
    );

    typedWriter.writerFunction(writer);
    expect<string>(writer.toString()).toBe('`one${"A" | "B"}two${"C" | "D"}three`');

    expect(typedWriter.kind).toBe(TypeStructureKind.TemplateLiteral);
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

    let count = 0;
    for (const kind of kinds) {
      if ((kind === TypeStructureKind.Infer) ||
          (kind === TypeStructureKind.Function) ||
          (kind === TypeStructureKind.Mapped)) {
        // cannot support these yet
        continue;
      }

      const _class = TypeStructureClassesMap.get(kind);
      expect(_class).withContext(TypeStructureKind[kind]).toBeTruthy();
      if (_class) {
        expect(_class.prototype.kind as TypeStructureKind).withContext(TypeStructureKind[kind]).toBe(kind);
      }
      count++;
    }

    expect(TypeStructureClassesMap.size).toBe(count);
  });

  xit("Each test covers a .clone() method", () => {
    expect(true).toBe(false);
  });

  xit("Each test covers a registerCallback case", () => {
    expect(true).toBe(false);
  });
});
