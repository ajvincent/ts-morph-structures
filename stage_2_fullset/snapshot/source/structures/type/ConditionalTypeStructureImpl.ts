import type { CodeBlockWriter, WriterFunction } from "ts-morph";

import { TypeStructureKind, type TypeStructures } from "../../exports.js";

import {
  type CloneableTypeStructure,
  TypeStructuresBase,
  TypeStructureClassesMap,
} from "../../internal-exports.js";

export interface ConditionalTypeStructureParts {
  checkType: string | TypeStructures;
  extendsType: string | TypeStructures;
  trueType: string | TypeStructures;
  falseType: string | TypeStructures;
}

/** `checkType` extends `extendsType` ? `trueType` : `falseType` */
export default class ConditionalTypeStructureImpl extends TypeStructuresBase<TypeStructureKind.Conditional> {
  public static clone(
    other: ConditionalTypeStructureImpl,
  ): ConditionalTypeStructureImpl {
    const parts: ConditionalTypeStructureParts = {
      checkType: TypeStructureClassesMap.clone(other.checkType),
      extendsType: TypeStructureClassesMap.clone(other.extendsType),
      trueType: TypeStructureClassesMap.clone(other.trueType),
      falseType: TypeStructureClassesMap.clone(other.falseType),
    };

    return new ConditionalTypeStructureImpl(parts);
  }

  readonly kind = TypeStructureKind.Conditional;
  public checkType: string | TypeStructures;
  public extendsType: string | TypeStructures;
  public trueType: string | TypeStructures;
  public falseType: string | TypeStructures;

  constructor(conditionalParts: Partial<ConditionalTypeStructureParts>) {
    super();

    this.checkType = conditionalParts.checkType ?? "never";
    this.extendsType = conditionalParts.extendsType ?? "never";
    this.trueType = conditionalParts.trueType ?? "never";
    this.falseType = conditionalParts.falseType ?? "never";

    this.registerCallbackForTypeStructure();
  }

  #writerFunction(writer: CodeBlockWriter): void {
    TypeStructuresBase.writeStringOrType(writer, this.checkType);
    writer.write(" extends ");
    TypeStructuresBase.writeStringOrType(writer, this.extendsType);
    writer.write(" ? ");
    TypeStructuresBase.writeStringOrType(writer, this.trueType);
    writer.write(" : ");
    TypeStructuresBase.writeStringOrType(writer, this.falseType);
  }

  readonly writerFunction: WriterFunction = this.#writerFunction.bind(this);
}
ConditionalTypeStructureImpl satisfies CloneableTypeStructure<ConditionalTypeStructureImpl>;
TypeStructureClassesMap.set(
  TypeStructureKind.Conditional,
  ConditionalTypeStructureImpl,
);
