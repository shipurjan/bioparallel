export function hasDuplicates<T>(array: T[]) {
    return new Set(array).size !== array.length;
}
