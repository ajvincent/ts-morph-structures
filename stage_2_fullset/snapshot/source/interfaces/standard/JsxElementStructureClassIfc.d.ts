import type {
  JsxAttributeImpl,
  JsxElementImpl,
  JsxSelfClosingElementImpl,
  JsxSpreadAttributeImpl,
} from "../../exports.js";
import type { StructureKind } from "ts-morph";

export interface JsxElementStructureClassIfc {
  readonly kind: StructureKind.JsxElement;
  attributes: (JsxAttributeImpl | JsxSpreadAttributeImpl)[];
  bodyText: string;
  children: (JsxElementImpl | JsxSelfClosingElementImpl)[];
}
