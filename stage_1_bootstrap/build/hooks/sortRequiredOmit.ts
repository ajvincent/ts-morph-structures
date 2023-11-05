import StructureDictionaries, {
  type DecoratorParts,
  type StructureParts,
} from "#stage_one/build/StructureDictionaries.js";

import {
  DecoratorImplMeta,
  StructureImplMeta,
} from "#stage_one/build/structureMeta/DataClasses.js";

import {
  StringTypedStructureImpl,
  TypeArgumentedTypedStructure,
  TypeArgumentedTypedStructureImpl,
  TypeStructureKind,
  UnionTypedStructureImpl,
} from "#stage_one/prototype-snapshot/exports.js";

import assert from 'node:assert/strict';

export default function sortRequiredOmit(
  name: string,
  meta: DecoratorImplMeta | StructureImplMeta,
  dictionaries: StructureDictionaries
): Promise<void>
{
  let parts: DecoratorParts | StructureParts;
  if (meta instanceof DecoratorImplMeta) {
    parts = dictionaries.decoratorParts.get(meta)!;
  } else {
    parts = dictionaries.structureParts.get(meta)!;
  }

  let typeArgumented: TypeArgumentedTypedStructure;
  if ("fieldsInstanceType" in parts)
    typeArgumented = parts.fieldsInstanceType;
  else {
    const { implementsSet } = parts.classDecl;
    const implementsArray = Array.from(implementsSet);
    typeArgumented = implementsArray[0] as TypeArgumentedTypedStructureImpl;
  }

  const stringTypes = getStringUnionTypes(typeArgumented);
  stringTypes.sort((a, b) => {
    return a.stringValue.localeCompare(b.stringValue)
  });

  return Promise.resolve();
}

function getStringUnionTypes(
  typeArgumented: TypeArgumentedTypedStructure
): StringTypedStructureImpl[]
{
  assert(
    (typeArgumented.objectType.kind === TypeStructureKind.Literal) &&
    (typeArgumented.objectType.stringValue === "RequiredOmit"),
    "expected RequredOmit type argument"
  );
  const unionType = typeArgumented.childTypes[1] as UnionTypedStructureImpl | undefined;
  if (!unionType)
    return [];

  const { childTypes } = unionType;
  childTypes.forEach((stringType, index) => {
    assert(
      stringType.kind === TypeStructureKind.String,
      "expected StringTypedStructureImpl at index " + index
    );
  });

  return childTypes as StringTypedStructureImpl[];
}
