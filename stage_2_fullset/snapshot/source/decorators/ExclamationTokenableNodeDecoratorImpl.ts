//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type { MixinClass, StaticAndInstance, SubclassDecorator } from "mixin-decorators";
import type { ExclamationTokenableNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const ExclamationTokenableNodeStructureKey: unique symbol
;
export type ExclamationTokenableNodeStructureFields = RightExtendsLeft<StaticAndInstance<typeof ExclamationTokenableNodeStructureKey>, {
        staticFields: object;
        instanceFields: Required<ExclamationTokenableNodeStructure>;
        symbolKey: typeof ExclamationTokenableNodeStructureKey;
    }>;

export default function ExclamationTokenableNode(baseClass: typeof StructureBase, context: ClassDecoratorContext): MixinClass<ExclamationTokenableNodeStructureFields["staticFields"], ExclamationTokenableNodeStructureFields["instanceFields"], typeof StructureBase> {
    void(context);

    class ExclamationTokenableNodeDecoratorImpl extends baseClass {
        hasExclamationToken = false;

        public static copyFields(source: ExclamationTokenableNodeStructure & Structures, target: Required<ExclamationTokenableNodeDecoratorImpl> & Structures): void {
            super.copyFields(source, target);
            target.hasExclamationToken = source.hasExclamationToken ?? false;
        }
    }

    return ExclamationTokenableNodeDecoratorImpl;
}

ExclamationTokenableNode satisfies SubclassDecorator<ExclamationTokenableNodeStructureFields, typeof StructureBase, false>;
