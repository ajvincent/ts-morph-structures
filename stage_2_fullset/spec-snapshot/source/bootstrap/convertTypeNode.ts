import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ProjectOptions,
  ScriptTarget,
  TypeNode,
  VariableDeclaration,
} from "ts-morph";

import {
  ArrayTypeStructureImpl,
  ConditionalTypeStructureImpl,
  FunctionTypeStructureImpl,
  FunctionWriterStyle,
  IntersectionTypeStructureImpl,
  ParenthesesTypeStructureImpl,
  StringTypeStructureImpl,
  TupleTypeStructureImpl,
  TypeArgumentedTypeStructureImpl,
  UnionTypeStructureImpl,
  TypeStructures
} from "#stage_two/snapshot/source/exports.js";

import {
  StructuresClassesMap
} from "#stage_two/snapshot/source/internal-exports.js";

import convertTypeNode from "#stage_two/snapshot/source/bootstrap/convertTypeNode.js";

import type {
  TypeNodeToTypeStructureConsole
} from "#stage_two/snapshot/source/bootstrap/types/conversions.js";

describe("convertTypeNode generates correct type structures, with type", () => {
  //#region set-up, tear-down
  let declaration: VariableDeclaration;
  let structure: string | TypeStructures | null;

  let failMessage: string | undefined;
  let failNode: TypeNode | null;
  function failCallback(message: string, typeNode: TypeNode): void {
    failMessage = message;
    failNode = typeNode;
  }
  failCallback satisfies TypeNodeToTypeStructureConsole;

  beforeAll(() => {
    failMessage = undefined;
    failNode = null;

    const TSC_CONFIG: ProjectOptions = {
      "compilerOptions": {
        "lib": ["es2022"],
        "module": ModuleKind.ESNext,
        "target": ScriptTarget.ESNext,
        "moduleResolution": ModuleResolutionKind.NodeNext,
      },
      skipAddingFilesFromTsConfig: true,
      useInMemoryFileSystem: true,
    };

    const project = new Project(TSC_CONFIG);
    const sourceFile = project.createSourceFile("file.ts", `
const refSymbol = Symbol("reference symbol");
enum NumberEnum {
  one = 1,
  two,
  three,
}

const A: string;
    `.trim() + "\n");
    declaration = sourceFile.getVariableDeclarationOrThrow("A");
  });
  beforeEach(() => {
    failMessage = undefined;
    failNode = null;
  });

  afterEach(() => structure = null);

  function setTypeStructure(
    rawType: string,
    console: TypeNodeToTypeStructureConsole
  ): void
  {
    declaration.setType(rawType);
    const typeNode = declaration.getTypeNodeOrThrow();
    structure = convertTypeNode(
      typeNode,
      console,
      node => StructuresClassesMap.clone(node.getStructure())
    );
  }
  //#endregion set-up, teardown

  //#region literals

  describe("string keyword", () => {
    function stringSpec(s: string): void {
      it(s, () => {
        setTypeStructure(s, failCallback);
        expect(structure).toBe(s);
        expect(failMessage).toBeUndefined();
        expect(failNode).toBeNull();
      });
    }

    stringSpec("any");
    stringSpec("boolean");
    stringSpec("false");
    stringSpec("never");
    stringSpec("number");
    stringSpec("null");
    stringSpec("object");
    stringSpec("string");
    stringSpec("symbol");
    stringSpec("true");
    stringSpec("undefined");
    stringSpec("unknown");
    stringSpec("void");
  });

  it("number literal", () => {
    setTypeStructure("12.5", failCallback);
    expect(structure).toBe("12.5");
    expect(failMessage).toBeUndefined()
    expect(failNode).toBeNull();
  });

  it(`string literal "foo"`, () => {
    setTypeStructure(`"foo"`, failCallback);
    expect(structure).toBeInstanceOf(StringTypeStructureImpl);
    if (structure instanceof StringTypeStructureImpl) {
      expect(structure.stringValue).toBe("foo");
    }
    expect(failMessage).toBe(undefined);
    expect(failNode).toBe(null);
  });

  it(`identifier (NumberStringType)`, () => {
    setTypeStructure(`NumberStringType`, failCallback);
    expect(structure).toBe("NumberStringType");
    expect(failMessage).toBeUndefined();
    expect(failNode).toBeNull();
  });

  //#endregion literals

  //#region complex types
  it("Array: of string", () => {
    setTypeStructure("string[]", failCallback);
    expect(structure).toBeInstanceOf(ArrayTypeStructureImpl);
    if (!(structure instanceof ArrayTypeStructureImpl))
      return;
    expect(structure.objectType).toBe("string");
    expect(failMessage).toBe(undefined);
    expect(failNode).toBe(null);
  });

  it("Conditional: true extends ReturnsModified ? BaseClassType : void", () => {
    setTypeStructure("true extends ReturnsModified ? BaseClassType : void", failCallback);
    expect(structure).toBeInstanceOf(ConditionalTypeStructureImpl);
    if (!(structure instanceof ConditionalTypeStructureImpl))
      return;

    const { checkType, extendsType, trueType, falseType } = structure;
    const types = [ checkType, extendsType, trueType, falseType ];

    expect(types).toEqual(["true", "ReturnsModified", "BaseClassType", "void"]);
    expect(failMessage).toBe(undefined);
    expect(failNode).toBe(null);
  });

  it(
    `Function: <StringType extends string, NumberType extends number = 1>(s: StringType, n) => boolean`,
    () => {
      setTypeStructure(
        `<StringType extends string, NumberType extends number = 1>(s: StringType, n) => boolean`,
        failCallback
      );
      expect(structure).toBeInstanceOf(FunctionTypeStructureImpl);
      if (!(structure instanceof FunctionTypeStructureImpl))
        return;

      expect(structure.name).toBe("");
      expect(structure.isConstructor).toBe(false);

      expect(structure.typeParameters.length).toBe(2);
      {
        const typeParam = structure.typeParameters[0];
        expect(typeParam.name).toBe("StringType");
        expect(typeParam.constraint).toBe("string");
        expect(typeParam.default).toBe(undefined);
      }

      {
        const typeParam = structure.typeParameters[1];
        expect(typeParam.name).toBe("NumberType");
        expect(typeParam.constraint).toBe("number");
        expect(typeParam.default).toBe("1");
      }

      expect(structure.parameters.length).toBe(2);
      {
        const param = structure.parameters[0];
        expect(param.name).toBe("s");
        expect(param.typeStructure).toBe("StringType");
      }
      {
        const param = structure.parameters[1];
        expect(param.name).toBe("n");
        expect(param.typeStructure).toBe(undefined);
      }

      expect(structure.restParameter).toBe(undefined);
      expect(structure.returnType).toBe("boolean");

      expect(structure.writerStyle).toBe(FunctionWriterStyle.Arrow);
      expect(failMessage).toBe(undefined);
      expect(failNode).toBe(null);
    }
  );

  it(
    `Function: new <StringType extends string, NumberType extends number = 1>(s: StringType, n) => boolean`,
    () => {
      setTypeStructure(
        `new <StringType extends string, NumberType extends number = 1>(s: StringType, n) => boolean`,
        failCallback
      );
      expect(structure).toBeInstanceOf(FunctionTypeStructureImpl);
      if (!(structure instanceof FunctionTypeStructureImpl))
        return;

      expect(structure.name).toBe("");
      expect(structure.isConstructor).toBe(true);

      expect(structure.typeParameters.length).toBe(2);
      {
        const typeParam = structure.typeParameters[0];
        expect(typeParam.name).toBe("StringType");
        expect(typeParam.constraint).toBe("string");
        expect(typeParam.default).toBe(undefined);
      }

      {
        const typeParam = structure.typeParameters[1];
        expect(typeParam.name).toBe("NumberType");
        expect(typeParam.constraint).toBe("number");
        expect(typeParam.default).toBe("1");
      }

      expect(structure.parameters.length).toBe(2);
      {
        const param = structure.parameters[0];
        expect(param.name).toBe("s");
        expect(param.typeStructure).toBe("StringType");
      }
      {
        const param = structure.parameters[1];
        expect(param.name).toBe("n");
        expect(param.typeStructure).toBe(undefined);
      }

      expect(structure.restParameter).toBe(undefined);
      expect(structure.returnType).toBe("boolean");

      expect(structure.writerStyle).toBe(FunctionWriterStyle.Arrow);
      expect(failMessage).toBe(undefined);
      expect(failNode).toBe(null);
    }
  );

  it("Intersection: of string and number", () => {
    setTypeStructure("string & number", failCallback);
    expect(structure).toBeInstanceOf(IntersectionTypeStructureImpl);
    if (structure instanceof IntersectionTypeStructureImpl) {
      expect(structure.childTypes.length).toBe(2);
      expect(structure.childTypes[0]).toBe("string");
      expect(structure.childTypes[1]).toBe("number");
    }
    expect(failMessage).toBe(undefined);
    expect(failNode).toBe(null);
  });

  it(`Parentheses: (true), meaning parentheses type`, () => {
    setTypeStructure(`(true)`, failCallback);
    expect(structure).toBeInstanceOf(ParenthesesTypeStructureImpl);
    if (!(structure instanceof ParenthesesTypeStructureImpl))
      return;
    expect(structure.childTypes.length).toBe(1);
    expect(structure.childTypes[0]).toBe("true");
    expect(failMessage).toBeUndefined();
    expect(failNode).toBeNull();
  });

  it("Tuple: [string, number]", () => {
    setTypeStructure("[string, number]", failCallback);
    expect(structure).toBeInstanceOf(TupleTypeStructureImpl);
    if (structure instanceof TupleTypeStructureImpl) {
      expect(structure.childTypes.length).toBe(2);
      expect(structure.childTypes[0]).toBe("string");
      expect(structure.childTypes[1]).toBe("number");
    }
    expect(failMessage).toBe(undefined);
    expect(failNode).toBe(null);
  });

  it(`TypeArgumented: Pick<NumberStringType, "repeatForward">`, () => {
    setTypeStructure(`Pick<NumberStringType, "repeatForward">`, failCallback);
    expect(structure).toBeInstanceOf(TypeArgumentedTypeStructureImpl);
    if (structure instanceof TypeArgumentedTypeStructureImpl) {
      expect(structure.objectType).toBe("Pick");
      expect(structure.childTypes.length).toBe(2);
      expect(structure.childTypes[0]).toBe("NumberStringType");
      expect(structure.childTypes[1]).toBeInstanceOf(StringTypeStructureImpl);
      expect((structure.childTypes[1] as StringTypeStructureImpl).stringValue).toBe("repeatForward");
    }
    expect(failMessage).toBe(undefined);
    expect(failNode).toBe(null);
  });

  it(`Union: of string and number`, () => {
    setTypeStructure("string | number", failCallback);
    expect(structure).toBeInstanceOf(UnionTypeStructureImpl);
    if (structure instanceof UnionTypeStructureImpl) {
      expect(structure.childTypes.length).toBe(2);
      expect(structure.childTypes[0]).toBe("string");
      expect(structure.childTypes[1]).toBe("number");
    }
    expect(failMessage).toBe(undefined);
    expect(failNode).toBe(null);
  });

  xit("Class implements, interface extends", () => {
    expect(1).toBe(2);
  });
  //#region complex types
});
