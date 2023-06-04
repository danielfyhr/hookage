export function parseDefinition(definition) {
  if (isString(definition)) {
    return [definition];
  }
  if (isArray(definition)) {
    return definition.map((d) => [d]);
  }
  if (isObject(definition)) {
    return Object.values(definition).map(parseDefinition);
  }
  return definition;
}

function isString(x) {
  return typeof x === "string";
}

function isArray(x) {
  return Array.isArray(x);
}

function isObject(x) {
  return typeof x === "object" && !isArray(x);
}
