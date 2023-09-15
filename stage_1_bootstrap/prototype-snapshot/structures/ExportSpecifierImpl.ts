// #region preamble
import {
  type ExportSpecifierStructure,
  type OptionalKind,
  StructureKind,
} from "ts-morph";

import StructureBase from "../base/StructureBase.js";
import StructuresClassesMap from "../base/StructuresClassesMap.js";

import type {
  CloneableStructure
} from "../types/CloneableStructure.js";
// #endregion preamble

export default class ExportSpecifierImpl
extends StructureBase
implements ExportSpecifierStructure
{
  name: string;
  alias: string | undefined;
  isTypeOnly = false;
  readonly kind: StructureKind.ExportSpecifier = StructureKind.ExportSpecifier;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static clone(
    other: OptionalKind<ExportSpecifierStructure>
  ): ExportSpecifierImpl
  {
    const clone = new ExportSpecifierImpl(other.name);

    StructureBase.cloneTrivia(other, clone);
    clone.isTypeOnly = other.isTypeOnly ?? false;
    clone.alias = other.alias;

    return clone;
  }
}
ExportSpecifierImpl satisfies CloneableStructure<ExportSpecifierStructure>;

StructuresClassesMap.set(StructureKind.ExportSpecifier, ExportSpecifierImpl);
