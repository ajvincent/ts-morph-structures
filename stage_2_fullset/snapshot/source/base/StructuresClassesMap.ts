import type { Class } from "type-fest";

import { StructureKind, type Structures } from "ts-morph";

import type { StructureImpls } from "../exports.js";

import { type CloneableStructure } from "../internal-exports.js";

class StructuresClassesMapClass extends Map<
  StructureKind,
  CloneableStructure<Structures, StructureImpls> & Class<StructureImpls>
> {
  public clone(structure: Structures): StructureImpls {
    return this.get(structure.kind)!.clone(structure);
  }

  public cloneArray(structures: Structures[]): StructureImpls[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return structures.map((structure) => this.clone(structure));
  }
}

const StructuresClassesMap = new StructuresClassesMapClass();
export default StructuresClassesMap;
