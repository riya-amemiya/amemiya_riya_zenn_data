---
title: "公開された設計文書と解説記事"
free: true
---

V8 公式ブログには flat 専用の最適化記事は存在しません。最も近い公式情報は、V8 v6.9 リリースノート (https://v8.dev/blog/v8-release-69) の「V8 v6.9 supports `Array.prototype.flat` and `Array.prototype.flatMap`」という出荷告知と、機能ページ https://v8.dev/features/array-flat-flatmap (Mathias Bynens 著、2019-06-11 公開) です。後者では使用例、depth 既定値 1、Infinity を渡せばフルフラット化できる旨が解説されています。

ElementsKind の公式解説は https://v8.dev/blog/elements-kinds にあります。V8 が 21 個の elements kind を持つこと、PACKED と HOLEY、SMI / DOUBLE / 一般オブジェクト要素の区別、遷移は一方向 (downward in the lattice) であること、HOLEY は永続的で SMI へ戻れないこと、といった内容です。これが array-flat.tq の `CalculateFlattenedLengthFast` が `PACKED_SMI_ELEMENTS` と `PACKED_DOUBLE_ELEMENTS` だけを「要素を見ずに length 合算」できる理論的根拠を与えてくれます。

外部の解説で最も詳しいのは、Riya Amemiya 氏の Zenn 記事「Chromium(V8)のArray.prototype.flatを最大約5倍高速化した」(https://zenn.dev/dinii/articles/675d47a6c21c83、2026-03-16 公開) です。記事では二パス設計の動機 (「割り当てを O(log n) 回から 1 回へ」)、ElementsKind 情報の使い方 (packed numeric なら O(1) で length 算出可能)、明示スタックの採用理由 (再帰回避と任意深さ対応)、bailout チェックポイント、JSC との比較が解説されています。

設計レビュー用のメーリングリスト投稿として「Re: [v8-dev] [Design/Perf] C++ fast path for Array.prototype.flat (2-pass, V8)」(http://www.mail-archive.com/v8-dev@googlegroups.com/msg162734.html) も公開されています。20K outer × 1K chunk のシナリオで 924ms → 58ms (約 16 倍) という最大値が示されていて、Leszek Swirski 氏が「fast-paths for a valid NoElements protector is a pattern we use elsewhere so it makes sense to use it for Array.prototype.flat too」と返答し、Gerrit (CL 7526287) への提出を促した経緯が読み取れます。
