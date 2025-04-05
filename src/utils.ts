import destr from "destr";
import type { AllowedValue, DamascoDocument } from "./types";

type DamascoRow = {
  [key: string]: any;
};

export function parseDocument<T>(document: DamascoRow): DamascoDocument<T> {
  return {
    _uid: document._uid as string,
    ...destr<T>(document.content),
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
