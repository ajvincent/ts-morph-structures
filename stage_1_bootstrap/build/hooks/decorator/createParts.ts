import {
  ClassDeclarationImpl,
  SourceFileImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import StructureDictionaries, {
  DecoratorParts,
} from "#stage_one/build/StructureDictionaries.js";
import type {
  DecoratorImplMeta
} from "#stage_one/build/structureMeta/DataClasses.js";

import defineCopyFieldsMethod from "#stage_one/build/utilities/defineCopyFieldsMethod.js";
import defineDecoratorImports from "#stage_one/build/utilities/defineDecoratorImports.js";
import defineDecoratorWrapper from "#stage_one/build/utilities/defineDecoratorWrapper.js";
import defineFieldsType from "#stage_one/build/utilities/defineFieldsType.js";

import ClassFieldStatementsMap from "#stage_one/build/utilities/public/ClassFieldStatementsMap.js";
import ClassMembersMap from "#stage_one/build/utilities/public/ClassMembersMap.js";

export default function createDecoratorParts(
  name: string,
  meta: DecoratorImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  const parts: Partial<DecoratorParts> = {};
  parts.classDecl = new ClassDeclarationImpl;
  parts.classDecl.name = meta.structureName.replace(/Structure$/, "StructureMixin");
  parts.classDecl.extends = "baseClass";

  parts.classFieldsStatements = new ClassFieldStatementsMap;
  parts.classMembersMap = new ClassMembersMap;

  parts.importsManager = defineDecoratorImports(meta, parts.classDecl.name);
  parts.sourceFile = new SourceFileImpl;

  parts.copyFields = defineCopyFieldsMethod(
    meta,
    parts as Pick<
      DecoratorParts,
      "classDecl" | "classFieldsStatements" | "classMembersMap" | "importsManager"
    >,
    dictionaries
  );

  const {
    fieldType,
    instanceFieldsArgumented
  } = defineFieldsType(meta.structureName);

  parts.fieldsTypeAlias = fieldType;
  parts.fieldsInstanceType = instanceFieldsArgumented;
  if (!parts.fieldsTypeAlias.name) {
    throw new Error("no type alias name?  " + name);
  }
  parts.wrapperFunction = defineDecoratorWrapper(meta, parts.classDecl, parts.fieldsTypeAlias);
  if (!parts.wrapperFunction.name) {
    throw new Error("no name for wrapper function? " + name);
  }

  parts.moduleInterfaces = [];

  dictionaries.decoratorParts.set(meta, parts as DecoratorParts);
  return Promise.resolve();
}
