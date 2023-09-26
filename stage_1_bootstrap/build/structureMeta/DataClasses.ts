import { DefaultMap } from "#utilities/source/DefaultMap.js";

export type StructureName = string;
export type PropertyName = string;
export type StructureUnionName = string;

export type TSMorphTypeIdentifier = string;

export enum MetaType {
  Decorator,
  Structure,
  StructureUnion
}

export interface MetaImplementation {
  readonly metaType: MetaType;
}

export class PropertyValueInUnion {
  structureName: StructureName | undefined = undefined;
  isOptionalKind = false;

  unionName: StructureUnionName | undefined = undefined;

  /**
   * @example
   * `scope?: Scope;`
   * From ScopedNodeStructure, applies to ConstructorDeclarationStructure
   */
  tsmorph_Type: string | undefined = undefined;
}

export class PropertyValue
{
  fromTypeName: string | undefined = undefined;

  mayBeString = false;
  mayBeWriter = false;
  hasQuestionToken = false;
  mayBeUndefined = false;
  representsType = false;

  otherTypes: PropertyValueInUnion[] = [];
}

class BaseMetadata
{
  readonly booleanKeys = new Set<string>;
  readonly structureFields = new Map<PropertyName, PropertyValue>;
  readonly structureFieldArrays = new Map<PropertyName, PropertyValue>;
  readonly decoratorKeys = new Set<StructureName>;

  addField(
    propertyName: PropertyName,
    isArray: boolean,
    propertyValue: PropertyValue
  ): void
  {
    const map = isArray ? this.structureFieldArrays : this.structureFields;
    const existing = map.get(propertyName);
    if (existing) {
      if (propertyValue.otherTypes.length || existing.otherTypes.length) {
        throw new Error("property name conflict for existing versus added in otherTypes: " + propertyName);
      }

      existing.mayBeString &&= propertyValue.mayBeString;
      existing.mayBeWriter &&= propertyValue.mayBeWriter;
      existing.mayBeUndefined &&= propertyValue.mayBeUndefined;
      if (!propertyValue.hasQuestionToken)
        existing.hasQuestionToken = false;

      if (!propertyValue.fromTypeName) {
        existing.fromTypeName = undefined;
      }
      else if (existing.fromTypeName && existing.fromTypeName) {
        throw new Error("property name conflict for existing versus added in fromTypeName: " + propertyName);
      }
    } else {
      map.set(propertyName, propertyValue);
    }
  }
}

export class DecoratorImplMeta extends BaseMetadata implements MetaImplementation
{
  #useCount = 0;
  readonly metaType = MetaType.Decorator;
  readonly structureName: StructureName;

  get useCount(): number {
    return this.#useCount;
  }

  constructor(
    structureName: StructureName
  )
  {
    super();
    this.structureName = structureName;
  }

  incrementCount(): void {
    this.#useCount++;
  }
}

export class StructureImplMeta extends BaseMetadata implements MetaImplementation
{
  readonly metaType = MetaType.Structure;
  readonly structureName: StructureName;

  structureKindName = "";

  /** This may appear later. */
  syntaxKindName = "";

  constructor(
    structureName: StructureName
  )
  {
    super();
    this.structureName = structureName;
  }

  addField(
    propertyName: PropertyName,
    isArray: boolean,
    propertyValue: PropertyValue
  ): void
  {
    try {
      return super.addField(propertyName, isArray, propertyValue);
    }
    catch (ex) {
      console.error("this.structureName = " + this.structureName);
      throw ex;
    }
  }
}
export class StructureUnionMeta implements MetaImplementation
{
  readonly metaType = MetaType.StructureUnion;
  readonly unionName: StructureName;
  readonly structureNames = new Set<StructureName>;
  readonly unionKeys = new Set<StructureUnionName>;

  constructor(
    name: StructureName
  )
  {
    this.unionName = name;
  }
}

export type StructuresMeta = DecoratorImplMeta | StructureImplMeta | StructureUnionMeta;

export class StructureMetaDictionaries
{
  readonly decorators = new Map<StructureName, DecoratorImplMeta>;
  readonly structures = new DefaultMap<StructureName, StructureImplMeta>;
  readonly unions = new Map<StructureName, StructureUnionMeta>;

  addDefinition(
    meta: StructuresMeta
  ): void
  {
    switch (meta.metaType) {
      case MetaType.Decorator:
        this.decorators.set(meta.structureName, meta);
        return;
      case MetaType.Structure:
        this.structures.set(meta.structureName, meta);
        return;

      case MetaType.StructureUnion: {
        this.unions.set(meta.unionName, meta);
        const names = Array.from(meta.unionKeys);
        names.push(...Array.from(meta.structureNames));
        return;
      }
    }
  }

  getDecoratorCountMap(): ReadonlyMap<StructureName, number>
  {
    const map = new Map<StructureName, number>;
    this.decorators.forEach((dec, name) => map.set(name, dec.useCount));
    return map;
  }
}
