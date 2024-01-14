//#region preamble
import {
  ConstructorDeclarationOverloadImpl,
  type ConstructSignatureDeclarationImpl,
  type JSDocImpl,
  type ParameterDeclarationImpl,
  type TypeParameterDeclarationImpl,
} from "../exports.js";
import {
  type CloneableStructure,
  cloneStructureArray,
  cloneStructureOrStringArray,
  COPY_FIELDS,
  type ExtractStructure,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type PreferArrayFields,
  type RequiredOmit,
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
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ConstructorDeclarationOverloadStructure,
  type ConstructorDeclarationStructure,
  type OptionalKind,
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
  implements
    RequiredOmit<
      PreferArrayFields<ConstructorDeclarationStructure>,
      "returnType" | "scope"
    >
{
  readonly kind: StructureKind.Constructor = StructureKind.Constructor;
  readonly overloads: ConstructorDeclarationOverloadImpl[] = [];

  public static [COPY_FIELDS](
    source: OptionalKind<ConstructorDeclarationStructure>,
    target: ConstructorDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.overloads) {
      target.overloads.push(
        ...cloneStructureArray<
          OptionalKind<ConstructorDeclarationOverloadStructure>,
          StructureKind.ConstructorOverload,
          ConstructorDeclarationOverloadImpl
        >(source.overloads, StructureKind.ConstructorOverload),
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
      ...(cloneStructureOrStringArray<
        JSDocImpl,
        StructureKind.JSDoc,
        JSDocImpl
      >(
        signature.docs as (string | JSDocImpl)[],
        StructureKind.JSDoc,
      ) as JSDocImpl[]),
    );
    declaration.leadingTrivia.push(...signature.leadingTrivia);
    declaration.parameters.push(
      ...(StructuresClassesMap.cloneArray(
        signature.parameters as ParameterDeclarationImpl[],
      ) as ParameterDeclarationImpl[]),
    );
    if (signature.returnTypeStructure) {
      declaration.returnTypeStructure = TypeStructureClassesMap.clone(
        signature.returnTypeStructure,
      );
    }

    declaration.trailingTrivia.push(...signature.trailingTrivia);
    declaration.typeParameters.push(
      ...(StructuresClassesMap.cloneArray(
        signature.typeParameters as TypeParameterDeclarationImpl[],
      ) as TypeParameterDeclarationImpl[]),
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
