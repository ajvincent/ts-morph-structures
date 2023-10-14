import type {
  randomUUID
} from "crypto";

import type {
  Jsonify
} from "type-fest";

import type {
  SourceFileStructure
} from "ts-morph";

export type SerializeRequest = {
  command: "serializeSource",
  isRequest: true,
  token: ReturnType<typeof randomUUID>,
  absolutePathToFile: string,
  structure: Jsonify<SourceFileStructure>
};

export type SerializeResponse = {
  command: "serializeSource",
  isResponse: true,
  token: ReturnType<typeof randomUUID>,
  source: string,
};
