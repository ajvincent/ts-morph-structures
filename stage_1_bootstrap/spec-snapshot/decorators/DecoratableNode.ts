import MultiMixinBuilder from "mixin-decorators";

import {
  StructureKind
} from "ts-morph";

import StructureBase from "../../prototype-snapshot/base/StructureBase.js";

import DecoratableNode, {
  type DecoratableNodeStructureFields
} from "../../prototype-snapshot/decorators/DecoratableNode.js";

import {
  DecoratorImpl
} from "../../prototype-snapshot/exports.js";

it("ts-morph structure decorators: DecoratableNode", () => {
  const Foo = MultiMixinBuilder<[
    DecoratableNodeStructureFields
  ], typeof StructureBase>
  (
    [DecoratableNode],
    StructureBase
  );

  const target = new Foo;
  expect(target.decorators).toEqual([]);

  Foo.cloneDecoratable({
    decorators: [
      {
        name: "DecoratorNode",
        kind: StructureKind.Decorator,
        arguments: ["foo"],
        typeArguments: ["bar"]
      }
    ]
  }, target);

  const decorator = new DecoratorImpl("DecoratorNode");
  decorator.arguments.push("foo");
  decorator.typeArguments.push("bar");

  expect(target.decorators).toEqual([decorator]);
});