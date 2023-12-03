/*
import {
  CodeBlockWriter
} from "ts-morph";
*/

import {
  type TypeStructures,
  type stringOrWriterFunction,
} from "#stage_one/prototype-snapshot/exports.js";

import {
  TypeStructureSet
} from "#stage_one/prototype-snapshot/internal-exports.js";

export interface TypedNodeTypeStructure
{
  typeStructure: string | TypeStructures | undefined;
  type: stringOrWriterFunction | undefined;
}

export interface ReturnTypedNodeTypeStructure
{
  returnTypeStructure: string | TypeStructures | undefined;
  returnType: stringOrWriterFunction | undefined;
}

export interface TypeParameterWithTypeStructures
{
  constraintStructure: string | TypeStructures | undefined;
  constraint: stringOrWriterFunction | undefined;

  defaultStructure: TypeStructures | undefined;
  default: stringOrWriterFunction | undefined;
}

export interface ClassDeclarationWithImplementsTypeStructures
{
  implementsSet: TypeStructureSet;
  implements: stringOrWriterFunction[];
}

export interface InterfaceDeclarationWithExtendsTypeStructures
{
  extendsSet: TypeStructureSet;
  extends: stringOrWriterFunction[];
}
