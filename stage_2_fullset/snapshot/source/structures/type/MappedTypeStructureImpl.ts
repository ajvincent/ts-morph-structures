// #region preamble
import type { CodeBlockWriter, WriterFunction } from "ts-morph";

import { TypeParameterDeclarationImpl } from "../../exports.js";

import type { TypeStructures } from "./TypeStructures.js";

import TypeStructureClassesMap from "../../base/TypeStructureClassesMap.js";
import TypeStructuresWithTypeParameters from "./TypeStructuresWithTypeParameters.js";

import { TypeStructureKind } from "../../base/TypeStructureKind.js";

import type { CloneableTypeStructure } from "../../types/CloneableStructure.js";

// #endregion preamble

/**
 * `{ readonly [key in keyof Foo]: boolean }`
 *
 * @see `IndexedAccessTypeStructureImpl` for `Foo["index"]`
 * @see `ObjectLiteralTypeStructureImpl` for `{ [key: string]: boolean }`
 */
export default class MappedTypeStructureImpl extends TypeStructuresWithTypeParameters<TypeStructureKind.Mapped> {
  readonly kind: TypeStructureKind.Mapped = TypeStructureKind.Mapped;

  readonlyToken: "+readonly" | "-readonly" | "readonly" | undefined;
  parameter: TypeParameterDeclarationImpl;
  asName: string | TypeStructures | undefined = undefined;
  questionToken: "+?" | "-?" | "?" | undefined;
  type: string | TypeStructures | undefined;

  constructor(parameter: TypeParameterDeclarationImpl) {
    super();
    this.parameter = parameter;
    this.registerCallbackForTypeStructure();
  }

  #writerFunction(writer: CodeBlockWriter): void {
    writer.block(() => {
      if (this.readonlyToken) {
        writer.write(this.readonlyToken + " ");
      }
      writer.write("[");

      TypeStructuresWithTypeParameters.writeTypeParameter(
        this.parameter,
        writer,
        "in",
      );

      if (this.asName) {
        writer.write(" as ");
        MappedTypeStructureImpl.writeStringOrType(writer, this.asName);
      }

      writer.write("]");
      if (this.questionToken) {
        writer.write(this.questionToken);
      }

      if (this.type) {
        writer.write(": ");
        MappedTypeStructureImpl.writeStringOrType(writer, this.type);
      }

      writer.write(";");
    });
  }

  readonly writerFunction: WriterFunction = this.#writerFunction.bind(this);

  static clone(other: MappedTypeStructureImpl): MappedTypeStructureImpl {
    const clone = new MappedTypeStructureImpl(
      TypeParameterDeclarationImpl.clone(other.parameter),
    );

    if (other.asName) {
      clone.asName = TypeStructureClassesMap.clone(other.asName);
    }

    if (other.type) {
      clone.type = TypeStructureClassesMap.clone(other.type);
    }

    clone.readonlyToken = other.readonlyToken;
    clone.questionToken = other.questionToken;

    return clone;
  }
}

MappedTypeStructureImpl satisfies CloneableTypeStructure<MappedTypeStructureImpl>;
TypeStructureClassesMap.set(TypeStructureKind.Mapped, MappedTypeStructureImpl);
