import MultiMixinBuilder from "mixin-decorators";

import {
  Scope,
} from "ts-morph";

import StructureBase from "../../prototype-snapshot/base/StructureBase.js";

import ParameteredNode, {
  type ParameteredNodeStructureFields,
} from "../../prototype-snapshot/decorators/ParameteredNode.js";

import {
  ParameterDeclarationImpl
} from "../../exports.js";

it("ts-morph structure decorators: ParameteredNode", () => {
  const Foo = MultiMixinBuilder<[
    ParameteredNodeStructureFields
  ], typeof StructureBase>
  (
    [ParameteredNode],
    StructureBase
  );

  const target = new Foo;
  expect(target.parameters).toEqual([]);

  Foo.cloneParametered({}, target);
  expect(target.parameters).toEqual([]);

  const parameter = new ParameterDeclarationImpl("foo");
  parameter.scope = Scope.Private;
  parameter.type = "boolean";
  parameter.initializer = "false";

  Foo.cloneParametered({
    parameters: [ parameter ]
  }, target);

  expect(target.parameters.length).toBe(1);
  expect(target.parameters[0].scope).toBe(Scope.Private);
  expect(target.parameters[0].type).toBe("boolean");
  expect(target.parameters[0].initializer).toBe("false");
});
