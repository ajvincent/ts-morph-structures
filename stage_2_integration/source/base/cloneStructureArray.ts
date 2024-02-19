import {
  KindedStructure,
  OptionalKind,
  StructureKind,
  type Structures,
} from "ts-morph";

import type {
  stringOrWriterFunction
} from "../../snapshot/source/exports.js";

import {
  StructuresClassesMap,
} from "../../snapshot/source/internal-exports.js";

type ValueOrArray<T> = T | readonly T[];

// example: JsxElementStructure::attributes: (JsxSpreadAttributeStructure | OptionalKind<JsxAttributeStructure>)[]
export function cloneRequiredAndOptionalArray<
  RequiredSourceType extends Structures,
  RequiredSourceKind extends StructureKind,
  OptionalSourceType extends OptionalKind<Structures>,
  OptionalSourceKind extends StructureKind,
  RequiredTargetType extends RequiredSourceType,
  OptionalTargetType extends KindedStructure<OptionalSourceKind>
>
(
  sources: ValueOrArray<RequiredSourceType | OptionalSourceType>,
  requiredSourceKind: RequiredSourceKind,
  optionalSourceKind: OptionalSourceKind,
): readonly (RequiredTargetType | OptionalTargetType)[]
{
  const sourceArray = forceArray<RequiredSourceType | OptionalSourceType>(sources);
  return sourceArray.map(
    sourceValue => cloneRequiredOrOptionalStructure<
      RequiredSourceType,
      RequiredSourceKind,
      OptionalSourceType,
      OptionalSourceKind,
      RequiredTargetType,
      OptionalTargetType
    >(sourceValue, requiredSourceKind, optionalSourceKind)
  );
}

function forceArray<
  SourceType extends Structures  | OptionalKind<Structures> | stringOrWriterFunction
>
(
  sources: ValueOrArray<SourceType>
): readonly SourceType[]
{
  if (Array.isArray(sources)) {
    return sources as SourceType[];
  }
  return [sources as SourceType];
}

function cloneRequiredOrOptionalStructure<
  RequiredSourceType extends Structures,
  RequiredSourceKind extends StructureKind,
  OptionalSourceType extends OptionalKind<Structures>,
  OptionalSourceKind extends StructureKind,
  RequiredTargetType extends RequiredSourceType,
  OptionalTargetType extends KindedStructure<OptionalSourceKind>
>
(
  sourceValue: RequiredSourceType | OptionalSourceType,
  requiredSourceKind: RequiredSourceKind,
  optionalSourceKind: OptionalSourceKind,
): RequiredTargetType | OptionalTargetType
{
  if (sourceValue.kind === requiredSourceKind) {
    return cloneStructure<
      RequiredSourceType, RequiredSourceKind, RequiredTargetType
    >(sourceValue as RequiredSourceType, requiredSourceKind);
  }

  return cloneStructure<
    OptionalKind<OptionalSourceType>, OptionalSourceKind, OptionalTargetType
  >(sourceValue as OptionalSourceType, optionalSourceKind);
}

function cloneStructure<
  SourceType extends Structures | OptionalKind<Structures>,
  Kind extends StructureKind,
  TargetType extends KindedStructure<StructureKind>,
>
(
  sourceValue: SourceType,
  sourceKind: Kind,
): TargetType
{
  const CloneClass = StructuresClassesMap.get(sourceKind)!;
  return CloneClass.clone(sourceValue) as unknown as TargetType;
}
