import JSDocMap from "./JSDocMap.js";

const TSDocMap = new JSDocMap;
export default TSDocMap;

TSDocMap.addDecoratorFields(
  "QuestionTokenableNodeStructureMixin",
  {

  },
  {
    "hasQuestionToken": {
      description: "When true, inserts a question mark (?) after the field name.",
      tags: []
    },
  },
);
