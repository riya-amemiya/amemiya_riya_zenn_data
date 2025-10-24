import { describe, expect, test } from "bun:test";
import {
  createArrayWithConstructor,
  createArrayWithFill,
  createArrayWithForPush,
  createArrayWithFromMapper,
  createArrayWithOf,
  createArrayWithSpread,
} from "./array-generation.js";

describe("Array Generation Functions", () => {
  const testSizes = [0, 1, 10, 100, 1024];

  describe("All functions generate identical arrays", () => {
    test.each(testSizes)(
      "all functions produce identical sequential arrays for size %d",
      (size) => {
        const reference = createArrayWithFromMapper(size);

        const constructorArr = createArrayWithConstructor(size);
        const fromMapper = createArrayWithFromMapper(size);
        const spread = createArrayWithSpread(size);
        const fill = createArrayWithFill(size);
        const forPush = createArrayWithForPush(size);
        const ofArr = createArrayWithOf(size);

        expect(constructorArr).toEqual(reference);
        expect(fromMapper).toEqual(reference);
        expect(spread).toEqual(reference);
        expect(fill).toEqual(reference);
        expect(forPush).toEqual(reference);
        expect(ofArr).toEqual(reference);

        for (let i = 0; i < size; i++) {
          expect(constructorArr[i]).toBe(i);
          expect(fromMapper[i]).toBe(i);
          expect(spread[i]).toBe(i);
          expect(fill[i]).toBe(i);
          expect(forPush[i]).toBe(i);
          expect(ofArr[i]).toBe(i);
        }
      },
    );
  });

  describe("Length validation", () => {
    test.each(testSizes)("all functions create arrays of size %d", (size) => {
      expect(createArrayWithConstructor(size)).toHaveLength(size);
      expect(createArrayWithFromMapper(size)).toHaveLength(size);
      expect(createArrayWithSpread(size)).toHaveLength(size);
      expect(createArrayWithFill(size)).toHaveLength(size);
      expect(createArrayWithForPush(size)).toHaveLength(size);
      expect(createArrayWithOf(size)).toHaveLength(size);
    });
  });

  describe("Edge cases", () => {
    test("all functions handle zero size", () => {
      const expected: number[] = [];

      expect(createArrayWithConstructor(0)).toEqual(expected);
      expect(createArrayWithFromMapper(0)).toEqual(expected);
      expect(createArrayWithSpread(0)).toEqual(expected);
      expect(createArrayWithFill(0)).toEqual(expected);
      expect(createArrayWithForPush(0)).toEqual(expected);
      expect(createArrayWithOf(0)).toEqual(expected);
    });

    test("all functions create independent arrays", () => {
      const arr1 = createArrayWithFromMapper(3);
      const arr2 = createArrayWithFromMapper(3);
      const arr3 = createArrayWithConstructor(3);
      const arr4 = createArrayWithForPush(3);

      arr1[0] = 999;
      expect(arr2[0]).toBe(0);
      expect(arr3[0]).toBe(0);
      expect(arr4[0]).toBe(0);
    });
  });
});
