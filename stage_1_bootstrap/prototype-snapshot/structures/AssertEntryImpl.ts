// #region preamble
import {
  type AssertEntryStructure,
  type OptionalKind,
  StructureKind,
} from "ts-morph";

import StructureBase from "../base/StructureBase.js";

import StructuresClassesMap from "../base/StructuresClassesMap.js";

import {
  CloneableStructure
} from "../types/CloneableStructure.js";
import { ReplaceWriterInProperties } from "../types/ModifyWriterInTypes.js";
// #endregion preamble

export default class AssertEntryImpl
extends StructureBase
implements AssertEntryStructure
{
  readonly kind: StructureKind.AssertEntry = StructureKind.AssertEntry;
  name: string;
  value: string;

  constructor(
    name: string,
    value: string
  )
  {
    super();
    this.name = name;
    this.value = value;
  }

  public static clone(
    other: OptionalKind<AssertEntryStructure>
  ): AssertEntryImpl
  {
    const clone = new AssertEntryImpl(other.name, other.value);
    StructureBase.cloneTrivia(other, clone);
    return clone;
  }

  public toJSON(): ReplaceWriterInProperties<AssertEntryStructure>
  {
    return super.toJSON() as ReplaceWriterInProperties<AssertEntryStructure>;
  }
}
AssertEntryImpl satisfies CloneableStructure<AssertEntryStructure>;

StructuresClassesMap.set(StructureKind.AssertEntry, AssertEntryImpl);
