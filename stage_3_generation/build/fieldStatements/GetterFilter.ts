import type {
  MemberedStatementsKey
} from "#stage_two/snapshot/source/exports.js";
import StatementGetterBase from "./GetterBase.js";

export default
abstract class GetterFilter extends StatementGetterBase
{
  abstract accept(
    key: MemberedStatementsKey
  ): boolean;
}
