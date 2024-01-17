import type { CodeBlockWriter, WriterFunction } from "ts-morph";

import { TypeStructureKind } from "../../base/TypeStructureKind.js";

import TypeStructureClassesMap from "../../base/TypeStructureClassesMap.js";
import TypeStructuresBase from "./TypeStructuresBase.js";

import type { CloneableTypeStructure } from "../../types/CloneableStructure.js";

/** @example `Foo.bar.baz...` */
export default class QualifiedNameTypeStructureImpl extends TypeStructuresBase<TypeStructureKind.QualifiedName> {
  static clone(
    other: QualifiedNameTypeStructureImpl,
  ): QualifiedNameTypeStructureImpl {
    return new QualifiedNameTypeStructureImpl(other.childTypes.slice());
  }

  readonly kind = TypeStructureKind.QualifiedName;
  public childTypes: string[];

  constructor(childTypes: string[] = []) {
    super();
    this.childTypes = childTypes;
    this.registerCallbackForTypeStructure();
  }

  #writerFunction(writer: CodeBlockWriter): void {
    writer.write(this.childTypes.join("."));
  }

  readonly writerFunction: WriterFunction = this.#writerFunction.bind(this);
}
QualifiedNameTypeStructureImpl satisfies CloneableTypeStructure<QualifiedNameTypeStructureImpl>;
TypeStructureClassesMap.set(
  TypeStructureKind.QualifiedName,
  QualifiedNameTypeStructureImpl,
);
