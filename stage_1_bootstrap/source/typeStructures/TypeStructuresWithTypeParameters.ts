import type {
  CodeBlockWriter,
} from "ts-morph";

import {
  TypeStructureKind,
} from "../base/TypeStructureKind.js";

import TypeStructuresBase from "./TypeStructuresBase.js";

import {
  TypeParameterDeclarationImpl
} from "#stage_one/prototype-snapshot/exports.js";

export default
abstract class TypeStructuresWithTypeParameters<
  Kind extends TypeStructureKind
>
extends TypeStructuresBase<Kind>
{
  protected static writeTypeParameter(
    typeParam: TypeParameterDeclarationImpl,
    writer: CodeBlockWriter,
    constraintMode: "extends" | "in"
  ): void
  {
    writer.write(typeParam.name);

    switch (constraintMode) {
      case "extends":
        TypeStructuresWithTypeParameters.#writeConstraintExtends(typeParam, writer);
        break;
      case "in":
        TypeStructuresWithTypeParameters.#writeConstraintIn(typeParam, writer);
        break;
    }

    // isConst, variance not supported yet... need examples to test against
  }

  static #writeConstraintExtends(
    typeParam: TypeParameterDeclarationImpl,
    writer: CodeBlockWriter
  ): void
  {
    const constraint = typeParam.constraint;
    if (typeof constraint === "undefined")
      return;

    writer.write(" extends ");
    if (typeof constraint === "string") {
      writer.write(constraint);
    }
    else {
      constraint(writer);
    }

    const _default = typeParam.default;
    if (_default) {
      writer.write(" = ");
      if (typeof _default === "string") {
        writer.write(_default);
      }
      else {
        _default(writer);
      }
    }
  }

  static #writeConstraintIn(
    typeParam: TypeParameterDeclarationImpl,
    writer: CodeBlockWriter
  ): void
  {
    const constraint = typeParam.constraint;
    if (typeof constraint === "undefined")
      return;

    writer.write(" in ");
    if (typeof constraint === "string") {
      writer.write(constraint);
    }
    else {
      constraint(writer);
    }
  }
}
