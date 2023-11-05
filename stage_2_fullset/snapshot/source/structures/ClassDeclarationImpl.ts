//#region preamble
import {
  ConstructorDeclarationImpl,
  GetAccessorDeclarationImpl,
  MethodDeclarationImpl,
  PropertyDeclarationImpl,
  SetAccessorDeclarationImpl,
  type TypeStructures,
} from "../exports.js";
import {
  type AbstractableNodeStructureFields,
  AbstractableNodeStructureMixin,
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type CloneableStructure,
  cloneStructureArray,
  COPY_FIELDS,
  type DecoratableNodeStructureFields,
  DecoratableNodeStructureMixin,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type ExtractStructure,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NameableNodeStructureFields,
  NameableNodeStructureMixin,
  type PreferArrayFields,
  ReadonlyArrayProxyHandler,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  TypeAccessors,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
  TypeStructureSet,
} from "../internal-exports.js";
import type { stringOrWriterFunction } from "../types/stringOrWriterFunction.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ClassDeclarationStructure,
  type ConstructorDeclarationStructure,
  type GetAccessorDeclarationStructure,
  type MethodDeclarationStructure,
  type OptionalKind,
  type PropertyDeclarationStructure,
  type SetAccessorDeclarationStructure,
  StructureKind,
} from "ts-morph";
import type { Class, Jsonify } from "type-fest";
//#endregion preamble
const ClassDeclarationStructureBase = MultiMixinBuilder<
  [
    NameableNodeStructureFields,
    DecoratableNodeStructureFields,
    AbstractableNodeStructureFields,
    ExportableNodeStructureFields,
    AmbientableNodeStructureFields,
    TypeParameteredNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    NameableNodeStructureMixin,
    DecoratableNodeStructureMixin,
    AbstractableNodeStructureMixin,
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class ClassDeclarationImpl
  extends ClassDeclarationStructureBase
  implements
    RequiredOmit<
      PreferArrayFields<ClassDeclarationStructure>,
      "extends" | "name"
    >
{
  static readonly #implementsArrayReadonlyHandler =
    new ReadonlyArrayProxyHandler(
      "The implements array is read-only.  Please use this.implementsSet to set strings and type structures.",
    );
  readonly kind: StructureKind.Class = StructureKind.Class;
  readonly #extendsManager = new TypeAccessors();
  readonly #implements_ShadowArray: stringOrWriterFunction[] = [];
  readonly #implementsProxyArray = new Proxy<stringOrWriterFunction[]>(
    this.#implements_ShadowArray,
    ClassDeclarationImpl.#implementsArrayReadonlyHandler,
  );
  readonly ctors: ConstructorDeclarationImpl[] = [];
  readonly getAccessors: GetAccessorDeclarationImpl[] = [];
  readonly implementsSet = new TypeStructureSet(this.#implements_ShadowArray);
  readonly methods: MethodDeclarationImpl[] = [];
  readonly properties: PropertyDeclarationImpl[] = [];
  readonly setAccessors: SetAccessorDeclarationImpl[] = [];

  get extends(): stringOrWriterFunction | undefined {
    return this.#extendsManager.type;
  }

  set extends(value: stringOrWriterFunction | undefined) {
    this.#extendsManager.type = value;
  }

  get extendsStructure(): string | TypeStructures | undefined {
    return this.#extendsManager.typeStructure;
  }

  set extendsStructure(value: string | TypeStructures | undefined) {
    this.#extendsManager.typeStructure = value;
  }

  get implements(): stringOrWriterFunction[] {
    return this.#implementsProxyArray;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<ClassDeclarationStructure>,
    target: ClassDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.ctors) {
      target.ctors.push(
        ...cloneStructureArray<
          OptionalKind<ConstructorDeclarationStructure>,
          StructureKind.Constructor,
          ConstructorDeclarationImpl
        >(source.ctors, StructureKind.Constructor),
      );
    }

    if (source.extends) {
      target.extends = source.extends;
    }

    if (source.getAccessors) {
      target.getAccessors.push(
        ...cloneStructureArray<
          OptionalKind<GetAccessorDeclarationStructure>,
          StructureKind.GetAccessor,
          GetAccessorDeclarationImpl
        >(source.getAccessors, StructureKind.GetAccessor),
      );
    }

    if (Array.isArray(source.implements)) {
      target.implementsSet.replaceFromTypeArray(source.implements);
    } else if (typeof source.implements === "function") {
      target.implementsSet.replaceFromTypeArray([source.implements]);
    }

    if (source.methods) {
      target.methods.push(
        ...cloneStructureArray<
          OptionalKind<MethodDeclarationStructure>,
          StructureKind.Method,
          MethodDeclarationImpl
        >(source.methods, StructureKind.Method),
      );
    }

    if (source.properties) {
      target.properties.push(
        ...cloneStructureArray<
          OptionalKind<PropertyDeclarationStructure>,
          StructureKind.Property,
          PropertyDeclarationImpl
        >(source.properties, StructureKind.Property),
      );
    }

    if (source.setAccessors) {
      target.setAccessors.push(
        ...cloneStructureArray<
          OptionalKind<SetAccessorDeclarationStructure>,
          StructureKind.SetAccessor,
          SetAccessorDeclarationImpl
        >(source.setAccessors, StructureKind.SetAccessor),
      );
    }
  }

  public static clone(
    source: OptionalKind<ClassDeclarationStructure>,
  ): ClassDeclarationImpl {
    const target = new ClassDeclarationImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<ClassDeclarationStructure> {
    const rv = super.toJSON() as ClassDeclarationStructure;
    rv.ctors = this.ctors;
    if (this.extends) {
      rv.extends = StructureBase[REPLACE_WRITER_WITH_STRING](this.extends);
    }

    rv.getAccessors = this.getAccessors;
    rv.implements = this.implements.map((value) => {
      return StructureBase[REPLACE_WRITER_WITH_STRING](value);
    });
    rv.kind = this.kind;
    rv.methods = this.methods;
    rv.properties = this.properties;
    rv.setAccessors = this.setAccessors;
    return rv;
  }
}

ClassDeclarationImpl satisfies CloneableStructure<
  ClassDeclarationStructure,
  ClassDeclarationImpl
> &
  Class<ExtractStructure<ClassDeclarationStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.Class, ClassDeclarationImpl);
