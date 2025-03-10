import destr from "destr";

type DamascoRow = {
  [key: string]: any;
};

export function parseDocument(document: DamascoRow) {
  return {
    _uid: document._uid as string,
    ...(destr(document.content) as {}),
  };
}

export function stringyDocument(data: { [key: string]: unknown }) {
  return Object.entries(data).reduce((acc, [key, value]) => {
    if (key === "_uid") {
      return acc;
    }

    return {
      ...acc,
      [key]: JSON.stringify(value),
    };
  }, {});
}
