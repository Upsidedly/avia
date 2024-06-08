export function filterMap<const T, const K>(arr: T[], fn: (v: T) => K | undefined): K[] {
    const newArr = [];
    for (const v of arr) {
      const result = fn(v);
      if (result !== undefined) newArr.push(result);
    }
    return newArr;
}

export function createMemberPermissions(perms: number[]): string {
  return perms.reduce((acc, cur) => acc | cur, 0).toString();
}