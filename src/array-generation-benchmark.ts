import {
  bench,
  boxplot,
  do_not_optimize,
  type k_state,
  run,
  summary,
} from "mitata";

import {
  createArrayWithConstructor,
  createArrayWithFill,
  createArrayWithForPush,
  createArrayWithFromMapper,
  createArrayWithOf,
  createArrayWithSpread,
} from "./utils/array-generation.js";

// Benchmark various array generation methods

boxplot(() => {
  summary(() => {
    // Method 1: new Array(n) with for loop
    bench("new Array($size) + for loop", function* (state: k_state) {
      const size = state.get("size");
      yield () => do_not_optimize(createArrayWithConstructor(size));
    }).range("size", 1, 1024);

    // Method 2: Array.from with mapper
    bench(
      "Array.from({ length: $size }, (_, i) => i)",
      function* (state: k_state) {
        const size = state.get("size");
        yield () => do_not_optimize(createArrayWithFromMapper(size));
      },
    ).range("size", 1, 1024);

    // Method 3: Spread operator with map
    bench("[...Array($size)].map((_, i) => i)", function* (state: k_state) {
      const size = state.get("size");
      yield () => do_not_optimize(createArrayWithSpread(size));
    }).range("size", 1, 1024);

    // Method 4: Array.fill with map
    bench("Array($size).fill(0).map((_, i) => i)", function* (state: k_state) {
      const size = state.get("size");
      yield () => do_not_optimize(createArrayWithFill(size));
    }).range("size", 1, 1024);

    // Method 5: For loop with push
    bench("for loop with push ($size)", function* (state: k_state) {
      const size = state.get("size");
      yield () => do_not_optimize(createArrayWithForPush(size));
    }).range("size", 1, 1024);

    // Method 6: Array.of with Array.from
    bench(
      "Array.from(Array.of(...Array($size)), (_, i) => i)",
      function* (state: k_state) {
        const size = state.get("size");
        yield () => do_not_optimize(createArrayWithOf(size));
      },
    ).range("size", 1, 1024);
  });
});

await run();
