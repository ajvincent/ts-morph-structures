import {
  JSDocTagImpl
} from "#stage_two/snapshot/source/exports.js";
import {
  type JSDocTagStructure,
  type OptionalKind,
  StructureKind
} from "ts-morph";

describe("JSDocTagImpl", () => {
  it("sanity check: we can create one via constructor", () => {
    // warning: this really should have an argument for tagName
    const tag = new JSDocTagImpl;
    tag.tagName = "param";
    tag.text = "Hi Mom";

    expect(tag.kind).toBe(StructureKind.JSDocTag);
  });

  it("sanity check: we can create one via JSDocTagImpl.clone()", () => {
    const structure: OptionalKind<JSDocTagStructure> = {
      tagName: "param",
      text: "Hi Mom",

      leadingTrivia: [
        "// this is a lead"
      ],
      trailingTrivia: [
        "// this is a tail"
      ]
    };

    const tag = JSDocTagImpl.clone(structure);
    expect(tag.kind).toBe(StructureKind.JSDocTag);
    expect(tag.tagName).toBe("param");
    expect(tag.text).toBe("Hi Mom");
    expect(tag.leadingTrivia).not.toBe(structure.leadingTrivia);
    expect(tag.leadingTrivia).toEqual(structure.leadingTrivia);
    expect(tag.trailingTrivia).not.toBe(structure.trailingTrivia);
    expect(tag.trailingTrivia).toEqual(structure.trailingTrivia);
  });
});
