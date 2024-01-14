import {
  //MethodSignatureImpl
  ConstructorDeclarationImpl,
  ConstructSignatureDeclarationImpl,
  JSDocImpl,
  JSDocTagImpl,
  ParameterDeclarationImpl,
  TypeParameterDeclarationImpl,
} from "#stage_two/snapshot/source/exports.js";

describe("static fromSignature() methods generally work", () => {
  const tag = new JSDocTagImpl("param");
  tag.text = "Hi Mom";
  const baseDoc = new JSDocImpl;
  baseDoc.description = "Hello World";
  baseDoc.tags.push(tag);

  let doc: JSDocImpl;
  beforeEach(() => {
    doc = JSDocImpl.clone(baseDoc);
  });

  function checkDoc(clonedDoc: JSDocImpl): void {
    expect(clonedDoc).not.toBe(doc);
    expect(clonedDoc.description).toBe("Hello World");
    expect(clonedDoc.tags.length).toBe(1);
    expect(clonedDoc.tags[0]).not.toBe(tag);
    expect(clonedDoc.tags[0].tagName).toBe(tag.tagName);
    expect(clonedDoc.tags[0].text).toBe(tag.text);
  }

  it("on ConstructorDeclarationImpl", () => {
    const signature = new ConstructSignatureDeclarationImpl;
    signature.docs.push(doc);
    signature.leadingTrivia.push("// leading signature");
    signature.trailingTrivia.push("// trailing signature");

    signature.typeParameters.push(new TypeParameterDeclarationImpl("SignatureType"));
    {
      const param = new ParameterDeclarationImpl("mySignature");
      param.typeStructure = "SignatureType";
      signature.parameters.push(param);
    }

    signature.returnTypeStructure = "symbol";

    const decl: ConstructorDeclarationImpl = ConstructorDeclarationImpl.fromSignature(signature);
    checkDoc(decl.docs[0] as JSDocImpl);
    expect(decl.leadingTrivia).toEqual(signature.leadingTrivia);
    expect(decl.leadingTrivia).not.toBe(signature.leadingTrivia);
    expect(decl.trailingTrivia).toEqual(signature.trailingTrivia);
    expect(decl.trailingTrivia).not.toBe(signature.trailingTrivia);

    expect(decl.typeParameters.length).toBe(1);
    if (decl.typeParameters.length > 0) {
      const typeParam = decl.typeParameters[0];
      expect(typeof typeParam).toBe("object");
      if (typeof typeParam === "object") {
        expect(typeParam.name).toBe("SignatureType");
      }
      expect(typeParam).not.toBe(signature.typeParameters[0]);
    }

    expect(decl.parameters.length).toBe(1);
    if (decl.parameters.length > 0) {
      const param = decl.parameters[0] as ParameterDeclarationImpl;
      expect(param.name).toBe("mySignature");
      expect(param.typeStructure).toBe("SignatureType");
      expect(param).not.toBe(signature.parameters[0] as ParameterDeclarationImpl);
    }
  });
});