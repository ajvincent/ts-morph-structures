import assert from "node:assert/strict";

import {
  StructureKind
} from "ts-morph";

import TS_MORPH_D from "#utilities/source/ts-morph-d-file.js";

import {
  getTypeAugmentedStructure,
  LiteralTypeStructureImpl,
  TypeStructureKind,
  UnionTypeStructureImpl,
  VoidTypeNodeToTypeStructureConsole,
} from "#stage_two/snapshot/source/exports.js";

import {
  getStructureImplName,
  getUnionOfStructuresName,
} from "#utilities/source/StructureNameTransforms.js";

import {
  UnionModule
} from "../moduleClasses/exports.js";

interface StructuresAndUnions {
  structures: string[];
  unions: string[];
}

export default
async function fillStructureUnions(): Promise<readonly string[]>
{
  const { structures } = addStructureUnion("Structures");
  await UnionModule.saveFile();
  return structures;
}

function addStructureUnion(
  aliasName: string
): StructuresAndUnions
{
  const typeAlias = getTypeAugmentedStructure(
    TS_MORPH_D.getTypeAliasOrThrow(aliasName),
    VoidTypeNodeToTypeStructureConsole,
    true,
    StructureKind.TypeAlias
  ).rootStructure;

  typeAlias.name = getUnionOfStructuresName(typeAlias.name);
  UnionModule.aliases.set(typeAlias.name, typeAlias);

  let idUnion = typeAlias.typeStructure!;
  if (idUnion.kind === TypeStructureKind.Literal) {
    // cheating
    idUnion = new UnionTypeStructureImpl([idUnion]);
    typeAlias.typeStructure = idUnion;
  }
  assert.equal(idUnion.kind, TypeStructureKind.Union, "not a union for name " + aliasName);
  const children = idUnion.childTypes.splice(0, idUnion.childTypes.length);

  const impls: string[] = [];

  const structures: string[] = [], unions: string[] = [];
  children.forEach(child => {
    assert(child.kind === TypeStructureKind.Literal);
    if (child.stringValue.endsWith("Structures")) {
      (idUnion as UnionTypeStructureImpl).childTypes.push(LiteralTypeStructureImpl.get(
        getUnionOfStructuresName(child.stringValue)
      ));
      unions.push(child.stringValue);
    }
    else {
      const implName = getStructureImplName(child.stringValue);
      structures.push(child.stringValue);
      (idUnion as UnionTypeStructureImpl).childTypes.push(LiteralTypeStructureImpl.get(implName));
      impls.push(implName);
    }
  });

  idUnion.childTypes.sort((a, b): number =>
    (a as LiteralTypeStructureImpl).stringValue.localeCompare((b as LiteralTypeStructureImpl).stringValue)
  );

  UnionModule.addImports("public", [], structures.map(getStructureImplName));

  unions.forEach(unionChild => structures.push(...addStructureUnion(unionChild).structures));
  return { structures, unions };
}
