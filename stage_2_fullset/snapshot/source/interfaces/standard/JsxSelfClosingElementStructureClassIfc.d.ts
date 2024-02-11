import type {
  JsxAttributeImpl,
  JsxSpreadAttributeImpl,
} from "../../exports.js";
import type { StructureKind } from "ts-morph";

export interface JsxSelfClosingElementStructureClassIfc {
  readonly kind: StructureKind.JsxSelfClosingElement;
  attributes: (JsxAttributeImpl | JsxSpreadAttributeImpl)[];
}
