//#region preamble
import {
  ConstructorDeclarationImpl,
  GetAccessorDeclarationImpl,
  MethodDeclarationImpl,
  PropertyDeclarationImpl,
  SetAccessorDeclarationImpl,
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
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NameableNodeStructureFields,
  NameableNodeStructureMixin,
  REPLACE_WRITER_WITH_STRING,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
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
import type { Jsonify } from "type-fest";
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
  implements ClassDeclarationStructure
{
  readonly kind: StructureKind.Class = StructureKind.Class;
  readonly ctors: ConstructorDeclarationImpl[] = [];
  extends?: stringOrWriter = undefined;
  readonly getAccessors: GetAccessorDeclarationImpl[] = [];
  readonly implements: stringOrWriter[] = [];
  readonly methods: MethodDeclarationImpl[] = [];
  readonly properties: PropertyDeclarationImpl[] = [];
  readonly setAccessors: SetAccessorDeclarationImpl[] = [];

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

    if (source.properties) {
      target.properties.push(
        ...cloneStructureArray<
          OptionalKind<PropertyDeclarationStructure>,
          StructureKind.Property,
          PropertyDeclarationImpl
        >(source.properties, StructureKind.Property),
      );
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

    if (source.setAccessors) {
      target.setAccessors.push(
        ...cloneStructureArray<
          OptionalKind<SetAccessorDeclarationStructure>,
          StructureKind.SetAccessor,
          SetAccessorDeclarationImpl
        >(source.setAccessors, StructureKind.SetAccessor),
      );
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

    if (Array.isArray(source.implements)) {
      target.implements.push(...source.implements);
    } else if (source.implements !== undefined) {
      target.implements.push(source.implements);
    }

    if (source.extends) {
      target.extends = source.extends;
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
>;
StructuresClassesMap.set(StructureKind.Class, ClassDeclarationImpl);
