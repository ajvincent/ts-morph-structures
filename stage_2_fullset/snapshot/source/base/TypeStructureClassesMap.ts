import type { Class } from "type-fest";

import type { TypeStructures } from "../structures/type/TypeStructures.js";

import { KindedTypeStructure, TypeStructureKind } from "./TypeStructureKind.js";

import { CloneableTypeStructure } from "../types/CloneableStructure.js";

class TypeStructureClassesMapClass extends Map<
  TypeStructureKind,
  CloneableTypeStructure<TypeStructures> &
    Class<KindedTypeStructure<TypeStructureKind>>
> {
  clone(structure: string | TypeStructures): string | TypeStructures {
    if (typeof structure === "string") return structure;
    return this.get(structure.kind)!.clone(structure);
  }

  cloneArray(
    structures: (string | TypeStructures)[],
  ): (string | TypeStructures)[] {
    return structures.map((structure) => this.clone(structure));
  }
}

const TypeStructureClassesMap = new TypeStructureClassesMapClass();

export default TypeStructureClassesMap;
