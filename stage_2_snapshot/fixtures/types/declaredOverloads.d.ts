type ExpectedOutput<Outputs extends string = string> = Outputs;

declare class Base {
  static firstMethod(): void;
}

declare function overloadedFunction(): ExpectedOutput;
declare function overloadedFunction<SubsetOfStrings extends string>(options: SubsetOfStrings): ExpectedOutput<SubsetOfStrings>;
