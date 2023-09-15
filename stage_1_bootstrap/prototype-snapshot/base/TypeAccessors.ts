//#region preamble
import type {
  TypedNodeStructure,
  WriterFunction,
} from "ts-morph";

import {
  TypedNodeTypeStructure
} from "../typeStructures/TypeAndTypeStructureInterfaces.js";

import {
  stringOrWriterFunction
} from "../types/ts-morph-native.js";

import {
  TypeStructures
} from "../typeStructures/TypeStructures.js";

import {
  getTypeStructureForCallback,
  deregisterCallbackForTypeStructure,
} from "./callbackToTypeStructureRegistry.js";
import StructureBase from "./StructureBase.js";

import TypeStructureClassesMap from "./TypeStructureClassesMap.js";
import { TypeStructureKind } from "./TypeStructureKind.js";
import LiteralTypedStructureImpl from "../typeStructures/LiteralTypedStructureImpl.js";
import WriterTypedStructureImpl from "../typeStructures/WriterTypedStructureImpl.js";
// #endregion preamble

/**
 * This provides an API for converting between a type (`string | WriterFunction`) and a `TypeStructure`.
 *
 * For any class providing a type (return type, constraint, extends, etc.), you can have an instance of
 * `TypeAccessors` as a private class field, and provide getters and setters for type and typeStructure
 * referring to the private TypeAccessors.
 *
 * See `../decorators/TypedNode.ts` for an example.
 */
export default class TypeAccessors
extends StructureBase
implements TypedNodeStructure, TypedNodeTypeStructure
{
  typeStructure: TypeStructures | undefined = undefined;

  get type(): string | WriterFunction | undefined
  {
    if (!this.typeStructure)
      return undefined;

    if (this.typeStructure.kind === TypeStructureKind.Literal) {
      return this.typeStructure.stringValue;
    }

    return this.typeStructure.writerFunction;
  }

  set type(
    value: stringOrWriterFunction | undefined
  )
  {
    if (typeof value === "string") {
      this.typeStructure = new LiteralTypedStructureImpl(value);
      deregisterCallbackForTypeStructure(this.typeStructure);
      return;
    }

    if (typeof value === "function") {
      const knownTypeStructure = getTypeStructureForCallback(value);
      if (knownTypeStructure) {
        this.typeStructure = knownTypeStructure;
        return;
      }

      this.typeStructure = new WriterTypedStructureImpl(value);
      deregisterCallbackForTypeStructure(this.typeStructure);
      return;
    }

    this.typeStructure = undefined;
  }

  /**
   * Create a clone of an existing type, if it belongs to a type structure.
   *
   * If the underlying type structure exists, this will register the clone's type structure
   * for later retrieval.
   * @param type - the type to clone.
   * @returns the cloned type, or the original type if the type is not cloneable.
   */
  static cloneType(
    type: stringOrWriterFunction | undefined
  ): stringOrWriterFunction | undefined
  {
    if (typeof type !== "function")
      return type;

    const typeStructure = getTypeStructureForCallback(type);
    if (!typeStructure)
      return type;

    if (typeStructure.kind === TypeStructureKind.Literal)
      return typeStructure.stringValue;

    return TypeStructureClassesMap.clone(typeStructure).writerFunction;
  }
}
