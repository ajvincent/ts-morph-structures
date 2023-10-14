import StructureDictionaries, {
  DecoratorParts,
  StructureParts,
} from "#stage_one/build/StructureDictionaries.js";

import {
  DecoratorImplMeta,
  MetaType,
  StructureImplMeta,
} from "#stage_one/build/structureMeta/DataClasses.js";

import ClassMembersMap, {
  ClassMemberImpl
} from "../ClassMembersMap.js";

import { StructureKind } from "ts-morph";

import TSDocMap from "../structureMeta/TSDocMap.js";

type StaticAndInstanceMembers = {
  staticFields: ClassMemberImpl[];
  instanceFields: ClassMemberImpl[];
}

export default function addTSDoc(
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
  if (!parts)
    return Promise.resolve();

  const { classDecl, classMembersMap } = parts;
  const members = getMembers(classMembersMap);
  const className = classDecl.name!;

  const isStructureDef = meta.metaType === MetaType.Structure;
  TSDocMap.requireFields(
    isStructureDef,
    className,
    members.staticFields.map(getMemberName),
    members.instanceFields.map(getMemberName)
  );

  members.staticFields.forEach(member => {
    const doc = TSDocMap.getFieldDoc(isStructureDef, className, true, getMemberName(member));
    if (doc)
      member.docs.push(doc);
  });

  members.instanceFields.forEach(member => {
    const doc = TSDocMap.getFieldDoc(isStructureDef, className, false, getMemberName(member));
    if (doc)
      member.docs.push(doc);
  });

  return Promise.resolve();
}

function getMembers(
  membersMap: ClassMembersMap
): StaticAndInstanceMembers {
  const members: StaticAndInstanceMembers = {
    staticFields: [],
    instanceFields: [],
  };

  membersMap.forEach(member => {
    if (member.kind === StructureKind.Constructor) {
      members.instanceFields.push(member);
    }
    else if (member.isStatic) {
      members.staticFields.push(member);
    }
    else
      members.instanceFields.push(member);
  })

  return members;
}

function getMemberName(
  member: ClassMemberImpl
): string
{
  if (member.kind === StructureKind.Constructor)
    return "constructor";
  return member.name;
}
