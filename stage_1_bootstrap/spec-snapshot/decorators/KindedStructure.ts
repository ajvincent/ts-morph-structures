import MultiMixinBuilder from "mixin-decorators";

import {
  StructureKind
} from "ts-morph";

import KindedStructure, {
  type KindedStructureFields
} from "../../prototype-snapshot/decorators/KindedStructure.js";
import StructureBase from "../../prototype-snapshot/base/StructureBase.js";

it("ts-morph structure decorators: KindedStructure", () => {
  const Foo = MultiMixinBuilder<[
    KindedStructureFields<StructureKind.Decorator>
  ], typeof StructureBase>
  (
    [KindedStructure<StructureKind.Decorator>(StructureKind.Decorator)],
    StructureBase
  );

  expect((new Foo).kind).toBe(StructureKind.Decorator);
});
