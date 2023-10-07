import MultiMixinBuilder from "mixin-decorators";

import {
  AsyncableNodeStructureMixin,
  type AsyncableNodeStructureFields,
  ExportableNodeStructureMixin,
  type ExportableNodeStructureFields,
  StructureBase,
} from "#stage_two/snapshot/source/internal-exports.js";
import { Structures } from "ts-morph";

it("We can mix and match boolean decorators", () => {
  const FooBase = MultiMixinBuilder<[
    AsyncableNodeStructureFields,
    ExportableNodeStructureFields,
  ], typeof StructureBase>(
    [
      AsyncableNodeStructureMixin,
      ExportableNodeStructureMixin,
    ],
    StructureBase
  );

  class Foo extends FooBase {
    static copy(source: Foo): Foo {
      const target = new Foo;

      Foo.copyFields(source as Foo & Structures, target as Foo & Structures);
      return target;
    }

    static copyFields(source: Foo & Structures, target: Foo & Structures): void {
      super.copyFields(source, target);
    }
  }

  const AsyncNode = new Foo;
  AsyncNode.isAsync = true;
  AsyncNode.isDefaultExport = true;

  const TestClone = Foo.copy(AsyncNode);
  expect(TestClone.isAsync).toBeTrue();
  expect(TestClone.isDefaultExport).toBeTrue();
  expect(TestClone.isExported).toBeFalse();
});
