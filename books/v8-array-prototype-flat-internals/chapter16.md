---
title: "まとめ"
free: true
---

V8 の `Array.prototype.flat` の実装は、二パス高速路という小さな最適化に複数の土台が組み合わさって成立しています。

## 性能を支える四つの仕掛け

| 仕掛け | 役割 |
| --- | --- |
| 明示スタックによる反復化 | 任意深さに対応しつつ、ヒープ上の `GrowableFixedArray` で上限 (3072 エントリ) を制御 |
| Witness と protector ガード | map identity と `NoElements` / `ArraySpecies` の intact を検査し、副作用が出た瞬間に bailout |
| ElementsKind の一回確定 | 第一パスで `PACKED_SMI` / `PACKED_DOUBLE` / `PACKED_ELEMENTS` のどれを使うかを決める |
| FixedDoubleArray 直書き | tagged Number を float64 に変換しながらインライン書き込み、HeapNumber アロケーションを 0 にする |

## 土台の整合性

設計上の見どころは、要素を支える各機能が互いに噛み合っているところです。

| 土台 | 効いている場面 |
| --- | --- |
| ElementsKind の整数値が NativeContext の Map スロットと一対一対応 | `LoadJSArrayElementsMap(targetKind, ...)` が `int{kind} + FIRST_JS_ARRAY_MAP_SLOT` で済む |
| PACKED と HOLEY の判定が `kind % 2` | コンパイラの hole チェック省略 |
| `the_hole` と `kHoleNanInt64` の使い分け | tagged と double の両世界で穴を扱える |
| `kEmptyFixedArray` を read-only シングルトン | 長さ 0 の結果配列を 0 アロケーションで返せる |
| protector による楽観的仮定の検証可能化 | 仕様の動的意味論を「intact なら fast、破られたら bailout」の二元論に圧縮 |

flat の二パス設計はこの土台の上に「事前計測してから一回確保」というシンプルな最適化を載せただけのものです。それで 4 倍を超える速度向上を達成しているわけで、最適化の余地がどこに残っているかは「楽観的に仮定して、破られたら確実に検出して安全側に落ちる」という V8 全体の設計思想と切り離せません。
