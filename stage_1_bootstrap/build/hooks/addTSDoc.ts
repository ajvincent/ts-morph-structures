import StructureDictionaries, {
  DecoratorParts,
  StructureParts,
} from "#stage_one/build/StructureDictionaries.js";

import {
  DecoratorImplMeta,
  MetaType,
  StructureImplMeta,
} from "#stage_one/build/structureMeta/DataClasses.js";

import type {
  ClassDeclarationImpl,
  PropertyDeclarationImpl,
  MethodDeclarationImpl,
  ConstructorDeclarationImpl,
} from "#stage_one/prototype-snapshot/exports.js";
import { StructureKind } from "ts-morph";

import TSDocMap from "../structureMeta/TSDocMap.js";

type ClassMember = PropertyDeclarationImpl | MethodDeclarationImpl | ConstructorDeclarationImpl;

type StaticAndInstanceMembers = {
  staticFields: ClassMember[];
  instanceFields: ClassMember[];
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

  const { classDecl } = parts;
  const members = getMembers(classDecl);
  const className = classDecl.name!;

  const isStructureDef = meta.metaType === MetaType.Structure;
  TSDocMap.requireFields(
    isStructureDef,
    className,
    members.staticFields.map(getMemberName),
    members.instanceFields.map(getMemberName));

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
  classDecl: ClassDeclarationImpl
): StaticAndInstanceMembers {
  const members: StaticAndInstanceMembers = {
    staticFields: classDecl.ctors.slice(),
    instanceFields: [],
  };

  classDecl.properties.forEach(prop => {
    if (prop.isStatic)
      members.staticFields.push(prop);
    else
      members.instanceFields.push(prop);
  });
  classDecl.methods.forEach(prop => {
    if (prop.isStatic)
      members.staticFields.push(prop);
    else
      members.instanceFields.push(prop);
  });

  return members;
}

function getMemberName(
  member: ClassMember
): string
{
  if (member.kind === StructureKind.Constructor)
    return "constructor";
  return member.name;
}
