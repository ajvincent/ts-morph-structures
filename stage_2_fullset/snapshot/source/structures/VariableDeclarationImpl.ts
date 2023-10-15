//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExclamationTokenableNodeStructureFields,
  ExclamationTokenableNodeStructureMixin,
  type InitializerExpressionableNodeStructureFields,
  InitializerExpressionableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypedNodeStructureFields,
  TypedNodeStructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  OptionalKind,
  StructureKind,
  type VariableDeclarationStructure,
} from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
const VariableDeclarationStructureBase = MultiMixinBuilder<
  [
    ExclamationTokenableNodeStructureFields,
    InitializerExpressionableNodeStructureFields,
    TypedNodeStructureFields,
    NamedNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ExclamationTokenableNodeStructureMixin,
    InitializerExpressionableNodeStructureMixin,
    TypedNodeStructureMixin,
    NamedNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class VariableDeclarationImpl
  extends VariableDeclarationStructureBase
  implements VariableDeclarationStructure
{
  readonly kind: StructureKind.VariableDeclaration =
    StructureKind.VariableDeclaration;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static clone(
    source: OptionalKind<VariableDeclarationStructure>,
  ): VariableDeclarationImpl {
    const target = new VariableDeclarationImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<VariableDeclarationStructure> {
    const rv = super.toJSON() as VariableDeclarationStructure;
    rv.kind = this.kind;
    return rv;
  }
}

VariableDeclarationImpl satisfies CloneableStructure<
  VariableDeclarationStructure,
  VariableDeclarationImpl
>;
StructuresClassesMap.set(
  StructureKind.VariableDeclaration,
  VariableDeclarationImpl,
);
