//#region preamble
import {
  type JSDocImpl,
  MethodDeclarationOverloadImpl,
  type MethodSignatureImpl,
  type ParameterDeclarationImpl,
  type TypeParameterDeclarationImpl,
} from "../../exports.js";
import {
  type AbstractableNodeStructureFields,
  AbstractableNodeStructureMixin,
  type AsyncableNodeStructureFields,
  AsyncableNodeStructureMixin,
  type CloneableStructure,
  cloneStructureArray,
  cloneStructureOrStringArray,
  COPY_FIELDS,
  type DecoratableNodeStructureFields,
  DecoratableNodeStructureMixin,
  type ExtractStructure,
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
  type MethodDeclarationOverloadStructure,
  type MethodDeclarationStructure,
  type OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
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
  isStatic: boolean;
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

  public static fromSignature(
    isStatic: boolean,
    signature: MethodSignatureImpl,
  ): MethodDeclarationImpl {
    const declaration = new MethodDeclarationImpl(isStatic, signature.name);
    declaration.docs.push(
      ...(cloneStructureOrStringArray<
        JSDocImpl,
        StructureKind.JSDoc,
        JSDocImpl
      >(signature.docs, StructureKind.JSDoc) as JSDocImpl[]),
    );
    declaration.hasQuestionToken = signature.hasQuestionToken;
    declaration.leadingTrivia.push(...signature.leadingTrivia);
    declaration.parameters.push(
      ...(StructuresClassesMap.cloneArray(
        signature.parameters,
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

  public toJSON(): StructureClassToJSON<MethodDeclarationImpl> {
    const rv = super.toJSON() as StructureClassToJSON<MethodDeclarationImpl>;
    rv.isStatic = this.isStatic;
    rv.kind = this.kind;
    rv.overloads = this.overloads;
    return rv;
  }
}

MethodDeclarationImpl satisfies CloneableStructure<
  MethodDeclarationStructure,
  MethodDeclarationImpl
> &
  Class<ExtractStructure<MethodDeclarationStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.Method, MethodDeclarationImpl);
