export function d10(strs: TemplateStringsArray, ...args: (string | number)[]) {
  let result = strs[0];
  for (let i = 0; i < args.length; ++i) {
    const n = args[i];
    if (typeof n === "number") {
      result += Number(n).toFixed(10);
    } else {
      result += n;
    }
    result += strs[i + 1];
  }
  return result;
}