import type {
  Class
} from "type-fest";

import {
  type KindedStructure,
  type OptionalKind,
  StructureKind,
  type Structures,
} from "ts-morph";

import type {
  StructureImpls,
  stringOrWriterFunction,
} from "../../snapshot/source/exports.js";

import {
  type CloneableStructure
} from "../../snapshot/source/internal-exports.js";

type ValueOrArray<T> = T | readonly T[];

/** @internal */
class StructuresClassesMapClass extends Map<
  StructureKind,
  CloneableStructure<Structures, StructureImpls> & Class<StructureImpls>
>
{
  public clone<
    StructureType extends Structures,
    StructureImplType extends StructureImpls
  >
  (
    structure: StructureType
  ): StructureImplType
  {
    return this.get(structure.kind)!.clone(structure) as StructureImplType;
  }

  public cloneArray<
    StructureType extends stringOrWriterFunction | Structures,
    StructureImplType extends stringOrWriterFunction | StructureImpls
  >
  (
    structures: readonly StructureType[]
  ): StructureImplType[]
  {
    return structures.map(structure => {
      if ((typeof structure === "string") || (typeof structure === "function"))
        return structure;
      return this.clone(structure);
    }) as StructureImplType[];
  }

  public cloneArrayWithKind<
    StructureType extends Structures,
    Kind extends StructureKind,
    ResultType extends (stringOrWriterFunction | Extract<StructureImpls, KindedStructure<Kind>>)
  >
  (
    kind: Kind,
    structures: readonly (stringOrWriterFunction | OptionalKind<StructureType>)[]
  ): ResultType[]
  {
    return structures.map(structure => {
      if (typeof structure === "string" || typeof structure === "function")
        return structure;
      return this.get(kind)!.clone(structure) as Extract<StructureImpls, KindedStructure<Kind>>;
    }) as ResultType[];
  }

  public forceArray<
    SourceType extends Structures | OptionalKind<Structures> | stringOrWriterFunction
  >
  (
    sources: ValueOrArray<SourceType>
  ): SourceType[]
  {
    if (Array.isArray(sources)) {
      return sources as SourceType[];
    }
    return [sources as SourceType];
  }
}

const StructuresClassesMap = new StructuresClassesMapClass;
export default StructuresClassesMap;
