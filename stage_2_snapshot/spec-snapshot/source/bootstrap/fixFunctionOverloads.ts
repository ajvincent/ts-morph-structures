import {
  ModuleKind,
  ModuleResolutionKind,
  Project,
  type ProjectOptions,
  ScriptTarget,
  type SourceFile,
  type SourceFileStructure,
  StructureKind,
} from "ts-morph";

import fixFunctionOverloads from "#stage_two/snapshot/source/bootstrap/fixFunctionOverloads.js";

describe("fixFunctionOverloads works with", () => {
  let sourceFile: SourceFile;

  beforeAll(() => {
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
    sourceFile = project.createSourceFile("file.ts");
  });

  afterEach(() => {
    sourceFile.removeStatements([0, sourceFile.getStatements().length]);
  });

  it("functions having no overloads", () => {
    sourceFile.addStatements(`
function foo(x: number): void {
  void(x);
}
    `.trim());
    const structure: SourceFileStructure = sourceFile.getStructure();
    fixFunctionOverloads(structure);
    expect<SourceFileStructure>(structure).toEqual(
      {
        "kind": StructureKind.SourceFile,
        "statements": [
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
      }
    );
  });

  it("functions having an overload", () => {
    sourceFile.addStatements(`
function foo(x: number, y: string): void
function foo(x: number): void {
  void(x);
}
    `.trim());
    const structure: SourceFileStructure = sourceFile.getStructure();
    fixFunctionOverloads(structure);
    expect<SourceFileStructure>(structure).toEqual(
      {
        "kind": StructureKind.SourceFile,
        "statements": [
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
        ],
      }
    );
  });
});
