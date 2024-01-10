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
  ParenthesesTypeStructureImpl,
  StringTypeStructureImpl,
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

  it(`(true), meaning parentheses type`, () => {
    setTypeStructure(`(true)`, failCallback);
    expect(structure).toBeInstanceOf(ParenthesesTypeStructureImpl);
    if (!(structure instanceof ParenthesesTypeStructureImpl))
      return;
    expect(structure.childTypes.length).toBe(1);
    expect(structure.childTypes[0]).toBe("true");
    expect(failMessage).toBeUndefined();
    expect(failNode).toBeNull();
  });

  it(`identifier (NumberStringType)`, () => {
    setTypeStructure(`NumberStringType`, failCallback);
    expect(structure).toBe("NumberStringType");
    expect(failMessage).toBeUndefined();
    expect(failNode).toBeNull();
  });
});
