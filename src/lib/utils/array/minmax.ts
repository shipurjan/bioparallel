/* eslint-disable security/detect-object-injection */
/* eslint-disable no-plusplus */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export function arrayMin(arr: number[]) {
    if (arr.length === 0) return null;

    let len = arr.length;
    let min = Infinity;

    while (len--) {
        if (arr[len] < min) {
            min = arr[len];
        }
    }
    return min;
}

export function arrayMax(arr: number[]) {
    if (arr.length === 0) return null;

    let len = arr.length;
    let max = -Infinity;

    while (len--) {
        if (arr[len] > max) {
            max = arr[len];
        }
    }
    return max;
}
