import {
  PromiseAllParallel,
  PromiseAllSequence,
} from "#utilities/source/PromiseTypes.js";

import {
  pathToModule
} from "#utilities/source/AsyncSpecModules.js";

import {
  stageDir,
} from "./constants.js";

import {
  ClassDeclarationImpl,
  SourceFileImpl,
} from "../prototype-snapshot/exports.js";

import {
  DecoratorImplMeta,
  MetaType,
  StructureImplMeta,
  StructureMetaDictionaries,
  type StructuresMeta,
} from "./structureMeta/DataClasses.js";

import ImportManager from "./ImportManager.js";

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

export default
class StructureDictionaries extends StructureMetaDictionaries
{
  readonly metaToClassMap = new WeakMap<StructuresMeta, ClassDeclarationImpl>;
  readonly classToImportsMap = new WeakMap<ClassDeclarationImpl, ImportManager>;
  readonly classToSourceMap = new WeakMap<ClassDeclarationImpl, SourceFileImpl>;

  readonly #decoratorHooks = new Map<string, DecoratorHook>;
  readonly #structureHooks = new Map<string, StructureHook>;

  addDefinition(
    meta: StructuresMeta
  ): void
  {
    super.addDefinition(meta);

    let fileLocation;
    switch (meta.metaType) {
      case MetaType.Decorator:
        fileLocation = pathToModule(stageDir, "dist/source/decorators");
        break;
      case MetaType.Structure:
        fileLocation = pathToModule(stageDir, "dist/source/structures");
        break;
      case MetaType.StructureUnion:
        return;
    }

    const classDecl = new ClassDeclarationImpl;
    this.metaToClassMap.set(meta, new ClassDeclarationImpl);

    if (fileLocation)
      this.classToImportsMap.set(classDecl, new ImportManager(fileLocation));
    this.classToSourceMap.set(classDecl, new SourceFileImpl);
  }

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
