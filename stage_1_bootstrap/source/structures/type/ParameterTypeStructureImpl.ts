// #region preamble
import type {
  CodeBlockWriter,
} from "ts-morph";

import TypeStructureClassesMap from "../../base/TypeStructureClassesMap.js";

import type {
  TypeStructures
} from "./TypeStructures.js";

import {
  TypeStructureKind,
} from "../../base/TypeStructureKind.js";

import TypeStructuresBase from "./TypeStructuresBase.js";
import type {
  CloneableTypeStructure
} from "../../types/CloneableStructure.js";
// #endregion preamble

/** Just a parameter name and type for a `FunctionTypeStructureImpl`. */
export default class ParameterTypeStructureImpl
extends TypeStructuresBase<TypeStructureKind.Parameter>
{
  public static clone(
    other: ParameterTypeStructureImpl
  ): ParameterTypeStructureImpl
  {
    let typeClone: string | TypeStructures | undefined;
    if (other.typeStructure)
      typeClone = TypeStructureClassesMap.clone(other.typeStructure);
    return new ParameterTypeStructureImpl(other.name, typeClone);
  }

  public readonly kind = TypeStructureKind.Parameter;
  public readonly writerFunction = this.#writerFunction.bind(this);

  public name: string;
  public typeStructure: string | TypeStructures | undefined;

  constructor(
    name: string,
    typeStructure: string | TypeStructures | undefined
  )
  {
    super();
    this.name = name;
    this.typeStructure = typeStructure;
    this.registerCallbackForTypeStructure();
  }

  #writerFunction(
    writer: CodeBlockWriter
  ): void
  {
    writer.write(this.name);
    if (this.typeStructure) {
      writer.write(": ");
      TypeStructuresBase.writeStringOrType(writer, this.typeStructure);
    }
  }
}
ParameterTypeStructureImpl satisfies CloneableTypeStructure<ParameterTypeStructureImpl>;
TypeStructureClassesMap.set(TypeStructureKind.Parameter, ParameterTypeStructureImpl);
