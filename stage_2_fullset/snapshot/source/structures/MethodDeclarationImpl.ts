//#region preamble
import { MethodDeclarationOverloadImpl } from "../exports.js";
import {
  type AbstractableNodeStructureFields,
  AbstractableNodeStructureMixin,
  type AsyncableNodeStructureFields,
  AsyncableNodeStructureMixin,
  type CloneableStructure,
  cloneStructureArray,
  COPY_FIELDS,
  type DecoratableNodeStructureFields,
  DecoratableNodeStructureMixin,
  type GeneratorableNodeStructureFields,
  GeneratorableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type OverrideableNodeStructureFields,
  OverrideableNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type PreferArrayFields,
  type QuestionTokenableNodeStructureFields,
  QuestionTokenableNodeStructureMixin,
  type RequiredOmit,
  type ReturnTypedNodeStructureFields,
  ReturnTypedNodeStructureMixin,
  type ScopedNodeStructureFields,
  ScopedNodeStructureMixin,
  type StatementedNodeStructureFields,
  StatementedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type MethodDeclarationOverloadStructure,
  type MethodDeclarationStructure,
  type OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
const MethodDeclarationStructureBase = MultiMixinBuilder<
  [
    AsyncableNodeStructureFields,
    GeneratorableNodeStructureFields,
    OverrideableNodeStructureFields,
    DecoratableNodeStructureFields,
    AbstractableNodeStructureFields,
    QuestionTokenableNodeStructureFields,
    ScopedNodeStructureFields,
    StatementedNodeStructureFields,
    ParameteredNodeStructureFields,
    ReturnTypedNodeStructureFields,
    TypeParameteredNodeStructureFields,
    NamedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    AsyncableNodeStructureMixin,
    GeneratorableNodeStructureMixin,
    OverrideableNodeStructureMixin,
    DecoratableNodeStructureMixin,
    AbstractableNodeStructureMixin,
    QuestionTokenableNodeStructureMixin,
    ScopedNodeStructureMixin,
    StatementedNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class MethodDeclarationImpl
  extends MethodDeclarationStructureBase
  implements
    RequiredOmit<
      PreferArrayFields<MethodDeclarationStructure>,
      "returnType" | "scope"
    >
{
  readonly kind: StructureKind.Method = StructureKind.Method;
  readonly isStatic: boolean;
  readonly overloads: MethodDeclarationOverloadImpl[] = [];

  constructor(isStatic: boolean, name: string) {
    super();
    this.isStatic = isStatic;
    this.name = name;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<MethodDeclarationStructure>,
    target: MethodDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.overloads) {
      target.overloads.push(
        ...cloneStructureArray<
          OptionalKind<MethodDeclarationOverloadStructure>,
          StructureKind.MethodOverload,
          MethodDeclarationOverloadImpl
        >(source.overloads, StructureKind.MethodOverload),
      );
    }
  }

  public static clone(
    source: OptionalKind<MethodDeclarationStructure>,
  ): MethodDeclarationImpl {
    const target = new MethodDeclarationImpl(
      source.isStatic ?? false,
      source.name,
    );
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<MethodDeclarationStructure> {
    const rv = super.toJSON() as MethodDeclarationStructure;
    rv.isStatic = this.isStatic;
    rv.kind = this.kind;
    rv.overloads = this.overloads;
    return rv;
  }
}

MethodDeclarationImpl satisfies CloneableStructure<
  MethodDeclarationStructure,
  MethodDeclarationImpl
>;
StructuresClassesMap.set(StructureKind.Method, MethodDeclarationImpl);
