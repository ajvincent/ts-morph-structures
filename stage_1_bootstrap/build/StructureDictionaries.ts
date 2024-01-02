//#region preamble
import {
  WriterFunction,
} from "ts-morph";

import {
  PromiseAllParallel,
} from "#utilities/source/PromiseTypes.js";

import {
  ClassDeclarationImpl,
  FunctionDeclarationImpl,
  InterfaceDeclarationImpl,
  IntersectionTypedStructure,
  MethodDeclarationImpl,
  SourceFileImpl,
  TypeAliasDeclarationImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import {
  DecoratorImplMeta,
  StructureImplMeta,
  StructureMetaDictionaries,
} from "./structureMeta/DataClasses.js";

import ClassMembersMap from "./utilities/public/ClassMembersMap.js";

import ImportManager from "./utilities/public/ImportManager.js";

import {
  stageDir,
} from "./constants.js";

import { pathToModule } from "#utilities/source/AsyncSpecModules.js";
import ExportManagerCommit from "./utilities/ExportManagerCommit.js";
import ClassFieldStatementsMap from "./utilities/public/ClassFieldStatementsMap.js";
//#endregion preamble

export type DecoratorHook = (
  name: string,
  meta: DecoratorImplMeta,
  dictionaries: StructureDictionaries
) => Promise<void>;

export type StructureHook = (
  name: string,
  meta: StructureImplMeta,
  dictionaries: StructureDictionaries
) => Promise<void>;

export interface DecoratorParts {
  classDecl: ClassDeclarationImpl;
  classFieldsStatements: ClassFieldStatementsMap;
  classMembersMap: ClassMembersMap;
  importsManager: ImportManager;
  moduleInterfaces: InterfaceDeclarationImpl[];
  sourceFile: SourceFileImpl;
  copyFields: MethodDeclarationImpl;
  fieldsTypeAlias: TypeAliasDeclarationImpl;
  fieldsInstanceType: IntersectionTypedStructure;
  wrapperFunction: FunctionDeclarationImpl;
}

export interface StructureParts {
  mixinBaseWriter: WriterFunction;
  classDecl: ClassDeclarationImpl;
  classFieldsStatements: ClassFieldStatementsMap;
  classMembersMap: ClassMembersMap;
  importsManager: ImportManager;
  moduleInterfaces: InterfaceDeclarationImpl[];
  sourceFile: SourceFileImpl;
  copyFields: MethodDeclarationImpl;
}

const InternalExports = new ExportManagerCommit(
  pathToModule(stageDir, "dist/source/internal-exports.ts")
);
const PublicExports = new ExportManagerCommit(
  pathToModule(stageDir, "dist/source/exports.ts")
);

InternalExports.addExports({
  absolutePathToModule: pathToModule(stageDir, "dist/source/exports.ts"),
  exportNames: [],
  isDefaultExport: false,
  isType: false,
});

export default
class StructureDictionaries extends StructureMetaDictionaries
{
  readonly decoratorParts = new WeakMap<DecoratorImplMeta, DecoratorParts>;
  readonly structureParts = new WeakMap<StructureImplMeta, StructureParts>;

  readonly publicExports = PublicExports;
  readonly internalExports = InternalExports;

  readonly #decoratorHooks = new Map<string, DecoratorHook>;
  readonly #structureHooks = new Map<string, StructureHook>;

  addDecoratorHook(
    name: string,
    hook: DecoratorHook
  ): void
  {
    this.#decoratorHooks.set(name, hook);
  }

  addStructureHook(
    name: string,
    hook: StructureHook
  ): void
  {
    this.#structureHooks.set(name, hook);
  }

  async build(): Promise<void>
  {
    const decoratorNames: string[] = Array.from(this.decorators.keys());
    const structureNames: string[] = Array.from(this.structures.keys());

    await Promise.all([
      PromiseAllParallel(decoratorNames, name => this.runDecoratorHooks(name)),
      PromiseAllParallel(structureNames, name => this.runStructureHooks(name)),
    ]);
  }

  /** public for debugging purposes */
  async runDecoratorHooks(
    name: string
  ): Promise<void>
  {
    const entries = Array.from(this.#decoratorHooks.entries());
    const decorator: DecoratorImplMeta = this.decorators.get(name)!

    const errors: unknown[] = [];
    await PromiseAllParallel(entries, async ([hookName, hook]): Promise<void> => {
      try {
        await hook(name, decorator, this);
      }
      catch (ex) {
        console.error(`Failed on decorator ${name} with hook ${hookName}`);
        errors.push(ex);
      }
    });

    if (errors.length) {
      throw new AggregateError(errors);
    }
  }

  /** public for debugging purposes */
  async runStructureHooks(
    name: string
  ): Promise<void>
  {
    const entries = Array.from(this.#structureHooks.entries());
    const structure: StructureImplMeta = this.structures.get(name)!;

    const errors: unknown[] = [];

    await PromiseAllParallel(entries, async ([hookName, hook]): Promise<void> => {
      try {
        await hook(name, structure, this);
      }
      catch (ex) {
        console.error(`Failed on structure ${name} with hook ${hookName}`);
        errors.push(ex);
      }
    });

    if (errors.length) {
      throw new AggregateError(errors);
    }
  }
}
