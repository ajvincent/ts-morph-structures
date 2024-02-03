// #region preamble
import type {
  CodeBlockWriter,
  WriterFunction,
} from "ts-morph";

import {
  TypeParameterDeclarationImpl,
  TypeStructureKind,
} from "../../../snapshot/source/exports.js";

import {
  type CloneableTypeStructure,
  TypeStructureClassesMap,
  TypeStructuresWithTypeParameters,
} from "../../../snapshot/source/internal-exports.js";

// #endregion preamble

export default class InferTypeStructureImpl
extends TypeStructuresWithTypeParameters<TypeStructureKind.Infer>
{
  readonly kind: TypeStructureKind.Infer = TypeStructureKind.Infer;

  typeParameter: TypeParameterDeclarationImpl;

  constructor(
    typeParameter: TypeParameterDeclarationImpl
  )
  {
    super();
    this.typeParameter = typeParameter;
    this.registerCallbackForTypeStructure();
  }

  #writerFunction(writer: CodeBlockWriter): void
  {
    writer.write("infer ");
    TypeStructuresWithTypeParameters.writeTypeParameter(
      this.typeParameter, writer, "extends"
    );
  }

  readonly writerFunction: WriterFunction = this.#writerFunction.bind(this);

  public static clone(
    other: InferTypeStructureImpl
  ): InferTypeStructureImpl
  {
    return new InferTypeStructureImpl(
      TypeParameterDeclarationImpl.clone(other.typeParameter)
    );
  }
}

InferTypeStructureImpl satisfies CloneableTypeStructure<InferTypeStructureImpl>;
TypeStructureClassesMap.set(TypeStructureKind.Infer, InferTypeStructureImpl);
