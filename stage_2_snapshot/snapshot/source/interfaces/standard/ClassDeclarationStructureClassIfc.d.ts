import type {
  ConstructorDeclarationImpl,
  GetAccessorDeclarationImpl,
  MethodDeclarationImpl,
  PropertyDeclarationImpl,
  SetAccessorDeclarationImpl,
  TypeStructures,
  TypeStructureSet,
} from "../../exports.js";
import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import type { StructureKind } from "ts-morph";

export interface ClassDeclarationStructureClassIfc {
  readonly kind: StructureKind.Class;
  readonly ctors: ConstructorDeclarationImpl[];
  extends?: stringOrWriterFunction;
  extendsStructure: TypeStructures | undefined;
  readonly getAccessors: GetAccessorDeclarationImpl[];
  /** Treat this as a read-only array.  Use `.implementsSet` to modify this. */
  readonly implements: stringOrWriterFunction[];
  readonly implementsSet: TypeStructureSet;
  readonly methods: MethodDeclarationImpl[];
  readonly properties: PropertyDeclarationImpl[];
  readonly setAccessors: SetAccessorDeclarationImpl[];
}
