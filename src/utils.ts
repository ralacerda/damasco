import destr from "destr";
import type { AllowedValue } from "./types";
import { customTypes } from "./custom-types";

type DamascoRow = {
  [key: string]: any;
};

export function parseDocument(document: DamascoRow) {
  return {
    _uid: document._uid as string,
    ...(destr(document.content) as object),
  };
}

export function formatDocument(data: { [key: string | number]: AllowedValue }) {
  const result: { [key: string]: string | number } = {};

  for (const [key, value] of Object.entries(data)) {
    if (key === "_uid") {
      continue;
    }

    if (value instanceof Object && "__type" in value) {
      const customType = customTypes[value.__type];
      result[key] = customType.format(value.__value);
    }

    result[key] = JSON.stringify(value);
  }

  return result;
}
