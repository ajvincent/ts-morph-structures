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

export class PropertyValue
{
  fromTypeName: string | undefined = undefined;

  structureName: StructureName | undefined = undefined;
  isOptionalKind = false;

  unionName: StructureUnionName | undefined = undefined;

  mayBeString = false;
  mayBeWriter = false;
  mayBeUndefined = false;
  representsType = false;

  /**
   * @example
   * `scope?: Scope;`
   * From ScopedNodeStructure, applies to ConstructorDeclarationStructure
   */
  tsmorph_Types = new Set<TSMorphTypeIdentifier>;
}

class BaseMetadata
{
  readonly booleanKeys = new Set<string>;
  readonly structureFields = new Map<PropertyName, PropertyValue>;
  readonly structureFieldArrays = new Map<PropertyName, PropertyValue>;

  addField(
    propertyName: PropertyName,
    isArray: boolean,
    propertyValue: PropertyValue
  ): void
  {
    const map = isArray ? this.structureFieldArrays : this.structureFields;
    if (map.has(propertyName)) {
      // I may hit this for TypeAliasDeclarationStructure::type.
      // This is largely just a matter of writing good code to handle this case.
      throw new Error("you've been here before with the name " + propertyName);
    }

    map.set(propertyName, propertyValue);
  }

  toJSON(): object {
    return {
      booleanKeys: Array.from(this.booleanKeys),
      structureFields: Object.fromEntries(this.structureFields),
      structureFieldArrays: Object.fromEntries(this.structureFieldArrays)
    };
  }
}

export class DecoratorImplMeta extends BaseMetadata implements MetaImplementation
{
  readonly metaType = MetaType.Decorator;
  readonly structureName: StructureName;

  constructor(
    structureName: StructureName
  )
  {
    super();
    this.structureName = structureName;
  }
}

export class StructureImplMeta extends BaseMetadata implements MetaImplementation
{
  readonly metaType = MetaType.Structure;
  readonly structureName: StructureName;
  structureKindName = "";

  /** This may appear later. */
  syntaxKindName = "";

  decoratorKeys = new Set<StructureName>;
  inheritedProperties = new Map<StructureName, Set<StructureName>>;

  constructor(
    structureName: StructureName
  )
  {
    super();
    this.structureName = structureName;
  }
}
export class StructureUnionMeta implements MetaImplementation
{
  readonly metaType = MetaType.StructureUnion;
  readonly unionName: StructureName = "";
  readonly structureNames = new Set<StructureName>;
  readonly unionKeys = new Set<StructureUnionName>;
}

export type StructuresMeta = DecoratorImplMeta | StructureImplMeta | StructureUnionMeta;

export class StructureMetaDictionaries {
  readonly decorators = new Map<StructureName, DecoratorImplMeta>;
  readonly structures = new Map<StructureName, StructureImplMeta>;
  readonly unions = new Map<StructureName, StructureUnionMeta>;

  constructor(
    metaArray: readonly StructuresMeta[]
  )
  {
    metaArray.forEach(meta => {
      switch (meta.metaType) {
        case MetaType.Decorator:
          this.decorators.set(meta.structureName, meta);
          return;
        case MetaType.Structure:
          this.structures.set(meta.structureName, meta);
          return;
        case MetaType.StructureUnion:
          this.unions.set(meta.unionName, meta);
          return;
      }
    });
  }
}
