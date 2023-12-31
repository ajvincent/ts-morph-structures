/*
import {
  CodeBlockWriter
} from "ts-morph";
*/

import {
  type TypeStructures,
  type stringOrWriterFunction,
} from "../exports.js";

import { TypeStructureSet } from "../internal-exports.js";

export interface TypedNodeTypeStructure {
  typeStructure: string | TypeStructures | undefined;
  type: stringOrWriterFunction | undefined;
}

export interface ReturnTypedNodeTypeStructure {
  returnTypeStructure: string | TypeStructures | undefined;
  returnType: stringOrWriterFunction | undefined;
}

export interface TypeParameterWithTypeStructures {
  constraintStructure: string | TypeStructures | undefined;
  constraint: stringOrWriterFunction | undefined;

  defaultStructure: TypeStructures | undefined;
  default: stringOrWriterFunction | undefined;
}

export interface ClassDeclarationWithImplementsTypeStructures {
  implementsSet: TypeStructureSet;
  implements: stringOrWriterFunction[];
}

export interface InterfaceDeclarationWithExtendsTypeStructures {
  extendsSet: TypeStructureSet;
  extends: stringOrWriterFunction[];
}
