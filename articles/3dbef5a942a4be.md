---
title: "useState禁止令、useReducerを使え"
emoji: "👻"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [react]
published: true
---

## はじめに

修正や追加等はコメントまたはGitHubで編集リクエストをお待ちしております。

## 本題

useState便利ですよね？
Reactの状態管理といったらこれを思い浮かべると思います。
ですが状態が増えたらどうしますか？
複数の状態を更新するhookを作るときにsetStateを引数にいくつも取る？
気がついたら技術負債の完成です。
useReducerを使いましょう。

### useReducerの使い方

第一引数にreducer関数を渡します。
reducer関数は、第一引数にstate、第二引数に任意のオブジェクトを受け取り、stateを更新します。
利用する際は第一引数は省略します。

#### 一番シンプルな例

```tsx
interface State {
 name: string;
 email: string;
}

const [state, dispatch] = useReducer(
  (
   state: State,
   newState: {
    [key in keyof State]?: State[key];
   },
  ) => ({ ...state, ...newState }),
  { name: "", email: "" }
);

dispatch({ name: "hoge" });
```

#### Redux風

```tsx
interface State {
 name: string;
 email: string;
}

const [state, dispatch] = useReducer(
  (
   state: State,
   action: {
    type: "UPDATE_NAME" | "UPDATE_EMAIL";
    payload: string;
   },
  ) => {
   switch (action.type) {
    case "UPDATE_NAME":
     return { ...state, name: action.payload };
    case "UPDATE_EMAIL":
     return { ...state, email: action.payload };
    default:
     return state;
   }
  },
  { name: "", email: "" }
);

dispatch({ type: "UPDATE_NAME", payload: "hoge" });
```

### useReducerのメリット

useReducerを使うことで、一つのstateで複数の状態を管理できます。
一部の状態だけ更新したい場合は、reducer関数で更新したい状態だけ更新するようにします。
また、reducer関数はuseReducerの外に書くことができます。
これにより、コンポーネントの見通しが良くなります。
複数コンポーネントでreducer関数を共有することもできます。

```tsx
interface State {
 name: string;
 email: string;
}
const initialState: State = { name: "", email: "" };
export const reducer = (
 state: State,
 action: {
  type: "UPDATE_NAME" | "UPDATE_EMAIL";
  payload: string;
 },
) => {
 switch (action.type) {
  case "UPDATE_NAME":
   return { ...state, name: action.payload };
  case "UPDATE_EMAIL":
   return { ...state, email: action.payload };
  case "RESET":
   return initialState;
  default:
   return state;
 }
};

const [state, dispatch] = useReducer(reducer, initialState);
```

### RecoilとかReduxとはどうやって使い分けるの？

コンポーネントを跨ぐ場合useReducerはバケツリレーをしないといけません。
コンポーネント間で共有する情報はRecoil(ユーザーのログイン情報など)
コンポーネントだけの情報はuseReducer(お問い合わせフォームの入力内容など)

## まとめ

useReducerで技術負債を減らしましょう。
