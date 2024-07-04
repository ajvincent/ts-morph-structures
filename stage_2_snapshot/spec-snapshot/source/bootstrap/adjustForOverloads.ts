import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  type ProjectOptions,
  ScriptTarget,
  type SourceFile,
  type SourceFileStructure,
  StructureKind,
  StatementStructures,
  WriterFunction,
} from "ts-morph";

import {
  fixFunctionOverloads
} from "#stage_two/snapshot/source/bootstrap/adjustForOverloads.js";

describe("fixFunctionOverloads works with", () => {
  let sourceFile: SourceFile;

  beforeAll(() => {
    const TSC_CONFIG: ProjectOptions = {
      "compilerOptions": {
        "lib": ["es2022"],
        "module": ModuleKind.ESNext,
        "target": ScriptTarget.ESNext,
        "moduleResolution": ModuleResolutionKind.NodeNext,
        "noEmit": true,
        "declaration": true,
      },
      skipAddingFilesFromTsConfig: true,
      useInMemoryFileSystem: true,
    };

    const project = new Project(TSC_CONFIG);
    sourceFile = project.createSourceFile("file.ts");
  });

  afterEach(() => {
    sourceFile.removeStatements([0, sourceFile.getStatements().length]);
  });

  function compareSourceToStructure(source: string, expected: StatementStructures[]): void {
    sourceFile.addStatements(source.trim());
    const structure: SourceFileStructure = sourceFile.getStructure();
    fixFunctionOverloads(structure);
    expect<
      (string | WriterFunction | StatementStructures)[] | string | WriterFunction
    >(structure.statements!).toEqual(expected);
  }

  it("functions having no overloads", () => {
    compareSourceToStructure(
      `
function foo(x: number): void {
  void(x);
}
      `,
      [
        {
          "name": "foo",
          "statements": [
            "void(x);"
          ],
          "parameters": [
            {
              "name": "x",
              "type": "number",
              "isReadonly": false,
              "decorators": [],
              "hasQuestionToken": false,
              "hasOverrideKeyword": false,
              "kind": StructureKind.Parameter,
              "isRestParameter": false,
              "initializer": undefined,
              "scope": undefined,
            }
          ],
          "returnType": "void",
          "typeParameters": [],
          "docs": [],
          "isExported": false,
          "isDefaultExport": false,
          "hasDeclareKeyword": false,
          "isGenerator": false,
          "isAsync": false,
          "kind": StructureKind.Function,
          "overloads": []
        }
      ],
    );
  });

  it("functions having an overload", () => {
    compareSourceToStructure(
      `
function foo(x: number, y: string): void
function foo(x: number): void {
  void(x);
}
      `,
      [
        {
          "name": "foo",
          "statements": [
            "void(x);"
          ],
          "parameters": [
            {
              "name": "x",
              "type": "number",
              "isReadonly": false,
              "decorators": [],
              "hasQuestionToken": false,
              "hasOverrideKeyword": false,
              "kind": StructureKind.Parameter,
              "isRestParameter": false,
              "initializer": undefined,
              "scope": undefined,
            }
          ],
          "returnType": "void",
          "typeParameters": [],
          "docs": [],
          "isExported": false,
          "isDefaultExport": false,
          "hasDeclareKeyword": false,
          "isGenerator": false,
          "isAsync": false,
          "kind": StructureKind.Function,
          "overloads": [
            {
              "isExported": false,
              "isDefaultExport": false,
              "typeParameters": [],
              "docs": [],
              "hasDeclareKeyword": false,
              "parameters": [
                {
                  "name": "x",
                  "type": "number",
                  "isReadonly": false,
                  "decorators": [],
                  "hasQuestionToken": false,
                  "hasOverrideKeyword": false,
                  "kind": StructureKind.Parameter,
                  "isRestParameter": false,
                  "initializer": undefined,
                  "scope": undefined,
                },
                {
                  "name": "y",
                  "type": "string",
                  "isReadonly": false,
                  "decorators": [],
                  "hasQuestionToken": false,
                  "hasOverrideKeyword": false,
                  "kind": StructureKind.Parameter,
                  "isRestParameter": false,
                  "initializer": undefined,
                  "scope": undefined,
                }
              ],
              "returnType": "void",
              "isGenerator": false,
              "isAsync": false,
              "kind": StructureKind.FunctionOverload
            }
          ]
        }
      ]
    );
  });

  it("classes with constructor overloads", () => {
    compareSourceToStructure(
      `
class Bar {
  constructor(x: number, y: string, z: boolean)
  constructor(x: number, y: string)
  constructor(x: number)
  {
    void(x);
    void(y);
    void(z);
  }
}
      `,
      [
        {
          "kind": StructureKind.Class,
          "name": "Bar",
          "ctors": [
            {
              "kind": StructureKind.Constructor,
              "overloads": [
                {
                  "kind": StructureKind.ConstructorOverload,
                  "parameters": [
                    {
                      "name": "x",
                      "type": "number",
                      "isReadonly": false,
                      "decorators": [],
                      "hasQuestionToken": false,
                      "hasOverrideKeyword": false,
                      "kind": StructureKind.Parameter,
                      "isRestParameter": false,
                      "initializer": undefined,
                      "scope": undefined,
                    },
                    {
                      "name": "y",
                      "type": "string",
                      "isReadonly": false,
                      "decorators": [],
                      "hasQuestionToken": false,
                      "hasOverrideKeyword": false,
                      "kind": StructureKind.Parameter,
                      "isRestParameter": false,
                      "initializer": undefined,
                      "scope": undefined,
                    },
                    {
                      "name": "z",
                      "type": "boolean",
                      "isReadonly": false,
                      "decorators": [],
                      "hasQuestionToken": false,
                      "hasOverrideKeyword": false,
                      "kind": StructureKind.Parameter,
                      "isRestParameter": false,
                      "initializer": undefined,
                      "scope": undefined,
                    },
                  ],
                  "docs": [],
                  "returnType": undefined,
                  "scope": undefined,
                  "typeParameters": [],
                },
                {
                  "kind": StructureKind.ConstructorOverload,
                  "parameters": [
                    {
                      "name": "x",
                      "type": "number",
                      "isReadonly": false,
                      "decorators": [],
                      "hasQuestionToken": false,
                      "hasOverrideKeyword": false,
                      "kind": StructureKind.Parameter,
                      "isRestParameter": false,
                      "initializer": undefined,
                      "scope": undefined,
                    },
                    {
                      "name": "y",
                      "type": "string",
                      "isReadonly": false,
                      "decorators": [],
                      "hasQuestionToken": false,
                      "hasOverrideKeyword": false,
                      "kind": StructureKind.Parameter,
                      "isRestParameter": false,
                      "initializer": undefined,
                      "scope": undefined,
                    },
                  ],
                  "docs": [],
                  "returnType": undefined,
                  "scope": undefined,
                  "typeParameters": [],
                },
              ],
              "parameters": [
                {
                  "name": "x",
                  "type": "number",
                  "isReadonly": false,
                  "decorators": [],
                  "hasQuestionToken": false,
                  "hasOverrideKeyword": false,
                  "kind": StructureKind.Parameter,
                  "isRestParameter": false,
                  "initializer": undefined,
                  "scope": undefined,
                },
              ],
              "statements": [
                "void(x);", "void(y);", "void(z);"
              ],
              "docs": [],
              "typeParameters": [],
              "scope": undefined,
              "returnType": undefined,
            }
          ],
          "decorators": [],
          typeParameters: [],
          docs: [],
          isAbstract: false,
          isExported: false,
          implements: [],
          isDefaultExport: false,
          hasDeclareKeyword: false,
          staticBlocks: [],
          methods: [],
          properties: [],
          extends: undefined,
          getAccessors: [],
          setAccessors: [],
        }
      ]
    )
  });

  xit("classes with method overloads (static and non-static", () => {
    expect(false).toBe(true);
  });

  xit("declared classes (no body)", () => {
    expect(false).toBe(true);
  });

  xit("declared functions (no body)", () => {
    expect(false).toBe(true);
  });

  xit("declared namespace containing functions (no body)", () => {
    expect(false).toBe(true);
  });

  xit("declared namespace containing a class (no body)", () => {
    expect(false).toBe(true);
  });
`
class Bar {
  constructor(x: number, y: string, z: boolean)
  constructor(x: number, y: string)
  constructor(x: number)
  {
    const w = {x, y: "y"};
    const t = {
      ...w,
      z: false
    };
    void(t);
  }

  baz(x: number, y: string): void
  baz(x: number): void {
    void(x);
  }
}

function foo(x: number, y: string): void
function foo<NType extends number>(x: NType): void;
function foo(x: number): void
{
  void(x);
}

declare class Base<NType extends number> {
  constructor(x: number, y: string);
  constructor(x: NType);
  helloWorld(x: number, y: string): void;
  helloWorld<NType extends number>(x: NType): void;
}

declare function wop(x: number, y: string): void;
declare function wop<NType extends number>(x: NType): void;

declare namespace ReflectTest {
  function apply<T, A extends readonly unknown[], R>(
      target: (this: T, ...args: A) => R,
      thisArgument: T,
      argumentsList: Readonly<A>,
  ): R;
  function apply(target: Function, thisArgument: unknown, argumentsList: ArrayLike<unknown>): unknown;
}
`
});
