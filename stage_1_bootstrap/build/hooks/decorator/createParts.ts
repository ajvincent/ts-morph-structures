import {
  ClassDeclarationImpl, SourceFileImpl,
} from "../../../prototype-snapshot/exports.js";

import StructureDictionaries, {
  DecoratorStructureParts,
} from "../../StructureDictionaries.js";
import type {
  DecoratorImplMeta
} from "../../structureMeta/DataClasses.js";

import defineCopyFieldsMethod from "../../utilities/defineCopyFieldsMethod.js";
import defineDecoratorImports from "../../utilities/defineDecoratorImports.js";
import defineDecoratorWrapper from "../../utilities/defineDecoratorWrapper.js";
import defineFieldsType from "../../utilities/defineFieldsType.js";

export default function createDecoratorParts(
  name: string,
  meta: DecoratorImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  if (!meta.isBooleanKeysOnly())
    return Promise.resolve();

  const parts: Partial<DecoratorStructureParts> = {};
  parts.classDecl = new ClassDeclarationImpl;
  parts.classDecl.name = meta.structureName.replace(/Structure$/, "StructureMixin");
  parts.classDecl.extends = "baseClass";

  parts.importsManager = defineDecoratorImports(meta, parts.classDecl.name);
  parts.sourceFile = new SourceFileImpl;

  parts.copyFields = defineCopyFieldsMethod(meta, parts.classDecl);
  parts.typeAlias = defineFieldsType(meta.structureName);
  if (!parts.typeAlias.name) {
    throw new Error("no type alias name?  " + name);
  }
  parts.wrapperFunction = defineDecoratorWrapper(meta, parts.classDecl, parts.typeAlias);
  if (!parts.wrapperFunction.name) {
    throw new Error("no name for wrapper function? " + name);
  }

  dictionaries.decoratorParts.set(meta, parts as DecoratorStructureParts);
  return Promise.resolve();
}
