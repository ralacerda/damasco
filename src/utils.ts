import type { DamascoDocument } from "./types";
import { parse, stringify } from "devalue";

type DamascoRow = {
  [key: string]: any;
};

export function parseDocument<T>(document: DamascoRow): DamascoDocument<T> {
  return {
    _uid: document._uid as string,
    ...(parse(document.content) as T),
  };
}

export function stringifyDocument<T>(data: T | DamascoDocument<T>) {
  const { _uid, ...rest } = data as any;

  return stringify(rest);
}
