import {
  PromiseAllSequence,
} from "#utilities/source/PromiseTypes.js";

import {
  ClassDeclarationImpl,
  SourceFileImpl,
} from "../prototype-snapshot/exports.js";

import {
  StructureMetaDictionaries,
  type StructuresMeta,
} from "./structureMeta/DataClasses.js";

import ImportManager from "./ImportManager.mjs";

export default
class StructureDictionaries extends StructureMetaDictionaries
{
  readonly metaToClassMap = new WeakMap<StructuresMeta, ClassDeclarationImpl>;
  readonly classToImportsMap = new WeakMap<ClassDeclarationImpl, ImportManager>;
  readonly classToSourceMap = new WeakMap<ClassDeclarationImpl, SourceFileImpl>;

  readonly #hooks = new Map<string, (dictionary: StructureDictionaries) => Promise<void>>;

  addDefinition(
    meta: StructuresMeta
  ): void
  {
    super.addDefinition(meta);
    const classDecl = new ClassDeclarationImpl;
    this.metaToClassMap.set(meta, new ClassDeclarationImpl);
    this.classToImportsMap.set(classDecl, new ImportManager);
    this.classToSourceMap.set(classDecl, new SourceFileImpl);
  }

  addHook(
    name: string,
    hook: (dictionary: StructureDictionaries) => Promise<void>
  ): void
  {
    this.#hooks.set(name, hook);
  }

  async build(): Promise<void>
  {
    await PromiseAllSequence(Array.from(this.#hooks.entries()), async ([name, hook]) => {
      try {
        await hook(this);
      }
      catch (ex) {
        console.error("failed on hook " + name);
        throw ex;
      }
    });
  }
}
