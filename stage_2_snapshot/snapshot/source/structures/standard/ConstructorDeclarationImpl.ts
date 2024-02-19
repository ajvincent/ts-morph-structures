//#region preamble
import {
  ConstructorDeclarationOverloadImpl,
  type ConstructSignatureDeclarationImpl,
  type JSDocImpl,
  type ParameterDeclarationImpl,
  type TypeParameterDeclarationImpl,
} from "../../exports.js";
import {
  type CloneableStructure,
  type ConstructorDeclarationStructureClassIfc,
  COPY_FIELDS,
  type ExtractStructure,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type ReturnTypedNodeStructureFields,
  ReturnTypedNodeStructureMixin,
  type ScopedNodeStructureFields,
  ScopedNodeStructureMixin,
  type StatementedNodeStructureFields,
  StatementedNodeStructureMixin,
  StructureBase,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
  TypeStructureClassesMap,
} from "../../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ConstructorDeclarationOverloadStructure,
  type ConstructorDeclarationStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
//#endregion preamble
const ConstructorDeclarationStructureBase = MultiMixinBuilder<
  [
    ScopedNodeStructureFields,
    StatementedNodeStructureFields,
    ParameteredNodeStructureFields,
    ReturnTypedNodeStructureFields,
    TypeParameteredNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ScopedNodeStructureMixin,
    StatementedNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class ConstructorDeclarationImpl
  extends ConstructorDeclarationStructureBase
  implements ConstructorDeclarationStructureClassIfc
{
  readonly kind: StructureKind.Constructor = StructureKind.Constructor;
  readonly overloads: ConstructorDeclarationOverloadImpl[] = [];

  /** @internal */
  public static [COPY_FIELDS](
    source: OptionalKind<ConstructorDeclarationStructure>,
    target: ConstructorDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.overloads) {
      target.overloads.push(
        ...StructuresClassesMap.cloneArrayWithKind<
          ConstructorDeclarationOverloadStructure,
          StructureKind.ConstructorOverload,
          ConstructorDeclarationOverloadImpl
        >(
          StructureKind.ConstructorOverload,
          StructuresClassesMap.forceArray(source.overloads),
        ),
      );
    }
  }

  public static clone(
    source: OptionalKind<ConstructorDeclarationStructure>,
  ): ConstructorDeclarationImpl {
    const target = new ConstructorDeclarationImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }

  public static fromSignature(
    signature: ConstructSignatureDeclarationImpl,
  ): ConstructorDeclarationImpl {
    const declaration = new ConstructorDeclarationImpl();
    declaration.docs.push(
      ...StructuresClassesMap.cloneArray<
        string | JSDocImpl,
        string | JSDocImpl
      >(signature.docs),
    );
    declaration.leadingTrivia.push(...signature.leadingTrivia);
    declaration.parameters.push(
      ...StructuresClassesMap.cloneArray<
        ParameterDeclarationImpl,
        ParameterDeclarationImpl
      >(signature.parameters),
    );
    if (signature.returnTypeStructure) {
      declaration.returnTypeStructure = TypeStructureClassesMap.clone(
        signature.returnTypeStructure,
      );
    }

    declaration.trailingTrivia.push(...signature.trailingTrivia);
    declaration.typeParameters.push(
      ...StructuresClassesMap.cloneArray<
        string | TypeParameterDeclarationImpl,
        string | TypeParameterDeclarationImpl
      >(signature.typeParameters),
    );
    return declaration;
  }

  public toJSON(): StructureClassToJSON<ConstructorDeclarationImpl> {
    const rv =
      super.toJSON() as StructureClassToJSON<ConstructorDeclarationImpl>;
    rv.kind = this.kind;
    rv.overloads = this.overloads;
    return rv;
  }
}

ConstructorDeclarationImpl satisfies CloneableStructure<
  ConstructorDeclarationStructure,
  ConstructorDeclarationImpl
> &
  Class<ExtractStructure<ConstructorDeclarationStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.Constructor, ConstructorDeclarationImpl);
