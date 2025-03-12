import destr from "destr";
import type { AllowedValue } from "./types";

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
  const result: { [key: string]: AllowedValue } = {};

  for (const [key, value] of Object.entries(data)) {
    if (key === "_uid") {
      continue;
    }

    result[key] = value;
  }

  return result;
}
