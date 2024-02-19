import {
  KindedStructure,
  OptionalKind,
  StructureKind,
  type Structures,
} from "ts-morph";

import type { stringOrWriterFunction } from "../exports.js";

import { StructuresClassesMap } from "../internal-exports.js";

type ValueOrArray<T> = T | readonly T[];

// example: ImportDeclarationStructure::namedImports: OptionalKind<ImportSpecifierStructure>[]
export function cloneStructureStringOrWriterArray<
  SourceType extends Structures | OptionalKind<Structures>,
  Kind extends StructureKind,
  TargetType extends KindedStructure<Kind>,
>(
  sources: ValueOrArray<SourceType | stringOrWriterFunction>,
  sourceKind: Kind,
): readonly (TargetType | stringOrWriterFunction)[] {
  const sourceArray = forceArray<SourceType | stringOrWriterFunction>(sources);
  return sourceArray.map((sourceValue) =>
    cloneStructureStringOrWriter<SourceType, Kind, TargetType>(
      sourceValue,
      sourceKind,
    ),
  );
}

// example: JSDocableNodeStructure::docs: OptionalKind<JSDocStructure>[]
export function cloneStructureOrStringArray<
  SourceType extends Structures | OptionalKind<Structures>,
  Kind extends StructureKind,
  TargetType extends KindedStructure<Kind>,
>(
  sources: ValueOrArray<SourceType | string>,
  sourceKind: Kind,
): readonly (TargetType | string)[] {
  const sourceArray = forceArray<SourceType | string>(sources);
  return sourceArray.map((sourceValue) =>
    cloneStructureOrString<SourceType, Kind, TargetType>(
      sourceValue,
      sourceKind,
    ),
  );
}

// example: JsxElementStructure::attributes: (JsxSpreadAttributeStructure | OptionalKind<JsxAttributeStructure>)[]
export function cloneRequiredAndOptionalArray<
  RequiredSourceType extends Structures,
  RequiredSourceKind extends StructureKind,
  OptionalSourceType extends OptionalKind<Structures>,
  OptionalSourceKind extends StructureKind,
  RequiredTargetType extends RequiredSourceType,
  OptionalTargetType extends KindedStructure<OptionalSourceKind>,
>(
  sources: ValueOrArray<RequiredSourceType | OptionalSourceType>,
  requiredSourceKind: RequiredSourceKind,
  optionalSourceKind: OptionalSourceKind,
): readonly (RequiredTargetType | OptionalTargetType)[] {
  const sourceArray = forceArray<RequiredSourceType | OptionalSourceType>(
    sources,
  );
  return sourceArray.map((sourceValue) =>
    cloneRequiredOrOptionalStructure<
      RequiredSourceType,
      RequiredSourceKind,
      OptionalSourceType,
      OptionalSourceKind,
      RequiredTargetType,
      OptionalTargetType
    >(sourceValue, requiredSourceKind, optionalSourceKind),
  );
}

// example: ParameteredNodeStructure::parameters: OptionalKind<ParameterDeclarationStructure>[]
export function cloneStructureArray<
  SourceType extends Structures | OptionalKind<Structures>,
  Kind extends StructureKind,
  TargetType extends KindedStructure<Kind>,
>(sources: ValueOrArray<SourceType>, sourceKind: Kind): readonly TargetType[] {
  const sourceArray = forceArray<SourceType>(sources);
  return sourceArray.map((sourceValue) =>
    cloneStructure<SourceType, Kind, TargetType>(sourceValue, sourceKind),
  );
}

function forceArray<
  SourceType extends
    | Structures
    | OptionalKind<Structures>
    | stringOrWriterFunction,
>(sources: ValueOrArray<SourceType>): readonly SourceType[] {
  if (Array.isArray(sources)) {
    return sources as SourceType[];
  }
  return [sources as SourceType];
}

function cloneStructureStringOrWriter<
  SourceType extends Structures | OptionalKind<Structures>,
  Kind extends StructureKind,
  TargetType extends KindedStructure<StructureKind>,
>(
  sourceValue: SourceType | stringOrWriterFunction,
  sourceKind: Kind,
): TargetType | stringOrWriterFunction {
  if (typeof sourceValue === "function") return sourceValue;

  return cloneStructureOrString<SourceType, Kind, TargetType>(
    sourceValue,
    sourceKind,
  );
}

function cloneStructureOrString<
  SourceType extends Structures | OptionalKind<Structures>,
  Kind extends StructureKind,
  TargetType extends KindedStructure<StructureKind>,
>(sourceValue: SourceType | string, sourceKind: Kind): TargetType | string {
  if (typeof sourceValue === "string") return sourceValue;
  return cloneStructure<SourceType, Kind, TargetType>(sourceValue, sourceKind);
}

function cloneRequiredOrOptionalStructure<
  RequiredSourceType extends Structures,
  RequiredSourceKind extends StructureKind,
  OptionalSourceType extends OptionalKind<Structures>,
  OptionalSourceKind extends StructureKind,
  RequiredTargetType extends RequiredSourceType,
  OptionalTargetType extends KindedStructure<OptionalSourceKind>,
>(
  sourceValue: RequiredSourceType | OptionalSourceType,
  requiredSourceKind: RequiredSourceKind,
  optionalSourceKind: OptionalSourceKind,
): RequiredTargetType | OptionalTargetType {
  if (sourceValue.kind === requiredSourceKind) {
    return cloneStructure<
      RequiredSourceType,
      RequiredSourceKind,
      RequiredTargetType
    >(sourceValue as RequiredSourceType, requiredSourceKind);
  }

  return cloneStructure<
    OptionalKind<OptionalSourceType>,
    OptionalSourceKind,
    OptionalTargetType
  >(sourceValue as OptionalSourceType, optionalSourceKind);
}

function cloneStructure<
  SourceType extends Structures | OptionalKind<Structures>,
  Kind extends StructureKind,
  TargetType extends KindedStructure<StructureKind>,
>(sourceValue: SourceType, sourceKind: Kind): TargetType {
  const CloneClass = StructuresClassesMap.get(sourceKind)!;
  return CloneClass.clone(sourceValue) as unknown as TargetType;
}
