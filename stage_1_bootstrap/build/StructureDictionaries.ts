//#region preamble
import {
  WriterFunction,
} from "ts-morph";

import {
  PromiseAllParallel,
  PromiseAllSequence,
} from "#utilities/source/PromiseTypes.js";


import {
  ClassDeclarationImpl,
  FunctionDeclarationImpl,
  MethodDeclarationImpl,
  SourceFileImpl,
  TypeAliasDeclarationImpl,
} from "#stage_one/prototype-snapshot/exports.js";


import {
  DecoratorImplMeta,
  StructureImplMeta,
  StructureMetaDictionaries,
} from "./structureMeta/DataClasses.js";

import ImportManager from "./ImportManager.js";
import {
  PublicExports,
  InternalExports,
} from "./ExportManager.js";
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
  importsManager: ImportManager;
  sourceFile: SourceFileImpl;
  copyFields: MethodDeclarationImpl;
  fieldsTypeAlias: TypeAliasDeclarationImpl;
  wrapperFunction: FunctionDeclarationImpl;
}

export interface StructureParts {
  mixinBaseWriter: WriterFunction;
  classDecl: ClassDeclarationImpl;
  importsManager: ImportManager;
  sourceFile: SourceFileImpl;
  copyFields: MethodDeclarationImpl;
}

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
    await PromiseAllSequence(entries, async ([hookName, hook]): Promise<void> => {
      try {
        await hook(name, decorator, this);
      }
      catch (ex) {
        console.error(`Failed on decorator ${name} with hook ${hookName}`);
        throw ex;
      }
    });
  }

  /** public for debugging purposes */
  async runStructureHooks(
    name: string
  ): Promise<void>
  {
    const entries = Array.from(this.#structureHooks.entries());
    const structure: StructureImplMeta = this.structures.get(name)!;
    await PromiseAllSequence(entries, async ([hookName, hook]): Promise<void> => {
      try {
        await hook(name, structure, this);
      }
      catch (ex) {
        console.error(`Failed on structure ${name} with hook ${hookName}`);
      }
    });
  }
}
