---
title: '校内システムを作った話'
emoji: '✨'
type: 'tech' # tech: 技術記事 / idea: アイデア
topics: ['firebase', 'nextjs', 'typescript']
published: true
---

## はじめに

修正や追加等はコメントまたはGitHubで編集リクエストをお待ちしております。

通っている学校の不便な部分を自作システムで解決した話です。

## 本題

私は現在通信制の学校に通っています。
3年以上在籍、74単位修了、特別活動（学校が用意するイベント）に累計30時間参加すると卒業できます。
そんな学校ですが、自分が何単位修了したのか、特別活動はあと何時間参加すればいいのか、などは先生にいちいち確認する必要がありました。
生徒と先生、両者非常にめんどくさいです。
そこで無いなら作ろう精神で校内システムを作りました。

## 仕様

とりあえず、以下の仕様で機能を実装しました。

- 外部からのアクセスは防ぐ
- 先生は全てのデータを編集できる
- 生徒は自分のデータのみ編集できる
- 修了単位数や特別活動の参加時間は自動で計算される
- データはリロードしても消えない

プログラム周りは[Firebase](https://firebase.google.com/)と[Nextjs](https://nextjs.org/)を採用しました。
無いと思いますが、DDoS対策で[Cloudflare](https://www.cloudflare.com/)にデプロイしてます。

### 外部からのアクセスは防ぐ

私の学校は独自ドメインのGoogleアカウントが1人1人に割り当てられているので、そのメールアドレスで弾くことにしました。

### 先生は全てのデータを編集できる

Cloud Firestoreのセキュリティルールで制御しています。

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
   match /users/{userId} {
      allow read, update, delete: if request.auth != null && request.auth.uid == userId || get(/databases/$(db)/documents/users/$(request.auth.uid)).data.admin == true;
      allow create: if request.auth != null;
    }
  }
}
```

管理者(先生)にはadminフィールドをtrueにしています。

### 生徒は自分のデータのみ編集できる

Cloud Firestoreのセキュリティルールで、uidと一致するドキュメントのみ閲覧できるようにしています。

### 修了単位数や特別活動の参加時間は自動で計算される

Cloud Firestoreからデータを取得してフロントで計算しています。

### データはリロードしても消えない

`recoil-persist` を使って永続化しています。

```typescript
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();
export const userState = atom<{
    id: string;
    uid: string;
    displayName: string;
    email: string;
    admin: boolean;
    login: boolean;
    activeTime: string;
}>({
    key: 'user',
    default: {
        id: '',
        uid: '',
        displayName: '',
        email: '',
        admin: false,
        login: false,
        activeTime: '',
    },
    effects_UNSTABLE: [persistAtom],
    dangerouslyAllowMutability: true,
});
```

## 実装紹介

### ログイン

ログインはGoogleアカウントで行っています。
登録と同時に自動でユーザー情報をFirestoreに保存しています。
Cloudflareのキャッシュ機能のせいで誤ったユーザーに情報が表示されることを避けるために、
tokenをurlに付与しています。
外部の人は自動でユーザーを削除するようにしています。

:::details LoginComponent

```tsx
import Button from '@mui/material/Button';
import {
    deleteUser,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import {
    doc,
    getDoc,
    getFirestore,
    setDoc,
} from 'firebase/firestore';
import { NextRouter, useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { SetterOrUpdater, useSetRecoilState } from 'recoil';
import { takingClassState } from '../atoms/takingClassState';
import { userState } from '../atoms/userState';
import { auth } from '../modules/FirebaseApp';
const Login = ({
    buttonCss,
    provider,
    setUserAtom,
    logOut,
    router,
}: {
    buttonCss?: string;
    provider: GoogleAuthProvider;
    setUserAtom: SetterOrUpdater<{
        id: string;
        uid: string;
        displayName: string;
        email: string;
        admin: boolean;
        login: boolean;
        activeTime: string;
    }>;
    logOut: (delet: boolean) => Promise<void>;
    router: NextRouter;
}) => {
    // ハッシュ化関数
    const cryptoText = async (text: string) => {
        const msgUint8 = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest(
            'SHA-256',
            msgUint8,
        );
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    };

    return (
        <Button
            className={buttonCss}
            variant="outlined"
            onClick={() => {
                // ログイン
                signInWithPopup(auth, provider).then(
                    async (result) => {
                        // ユーザー情報を取得
                        const user = result.user;
                        /**
                         * 生徒アカウントはXXYYY Nameという形式になっている
                         * (XXは入学年度、YYYは番号)
                         */
                        const idAndName = user.displayName?.match(
                            /([0-9]+)([^0-9]+)/,
                        );

                        const db = getFirestore();
                        const dbRef = doc(db, `users`, user.uid);
                        const querySnapshot = await getDoc(dbRef);
                        // ユーザー情報がデータベースにあるか確認
                        if (querySnapshot.exists()) {
                            // データベースにある場合はデータベースの情報を取得
                            const data = querySnapshot.data();
                            setUserAtom({
                                displayName: data.userName,
                                email: data.email,
                                id: data.userId,
                                uid: user?.uid,
                                admin: data.admin,
                                login: true,
                                activeTime: data?.activeTime || '0',
                            });
                        } else if (idAndName) {
                            // データベースにない場合はユーザー情報をデータベースに登録
                            setUserAtom({
                                displayName: idAndName[2],
                                email: user?.email || '',
                                id: idAndName[1],
                                uid: user?.uid,
                                admin: false,
                                login: true,
                                activeTime: '0',
                            });
                            await setDoc(dbRef, {
                                userName: idAndName[2],
                                email: user?.email || '',
                                userId: idAndName[1],
                                admin: false,
                                activeTime: '0',
                                takingClass: '',
                                year: `${idAndName[1][0]}${idAndName[1][1]}`,
                                uid: user?.uid || '',
                            });
                        } else if (
                            /^.*?@(std\.)?hoge\.ac\.jp/.test(
                                user?.email || '',
                            )
                        ) {
                            // どの条件にも当てはまらないが校内の人なので仮登録
                            setUserAtom({
                                displayName: user?.displayName || '',
                                email: user?.email || '',
                                id: '0',
                                uid: user?.uid,
                                admin: false,
                                login: true,
                                activeTime: '0',
                            });
                        } else {
                            // 外部の人なのでログインを拒否
                            alert(
                                '学校のアカウントでログインしてください',
                            );
                            logOut(true).then(() => {
                                router.replace(`/`);
                                router.reload();
                            });
                        }
                        cryptoText(user.uid).then((uid) => {
                            router.replace(`/?token=${uid}`);
                        });
                    },
                );
            }}>
            ログイン
        </Button>
    );
};
export const LoginComponent = ({
    buttonCss,
}: {
    buttonCss?: string;
}) => {
    const provider = new GoogleAuthProvider();
    // ログイン状態を取得
    const [user, loading, _error] = useAuthState(auth);
    const userUid = user?.uid || '';
    const setUserAtom = useSetRecoilState(userState);
    const setTakingClass = useSetRecoilState(takingClassState);
    const router = useRouter();
    const logOut = async (delet: boolean) => {
        if (delet && auth.currentUser) {
            deleteUser(auth.currentUser);
        }
        signOut(auth);
        setUserAtom({
            displayName: '',
            email: '',
            id: '',
            admin: false,
            uid: '',
            login: false,
            activeTime: '0',
        });
        setTakingClass({
            value: [],
            indexs: [],
            count: 0,
        });
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user) {
        return (
            <Login
                buttonCss={buttonCss}
                provider={provider}
                setUserAtom={setUserAtom}
                logOut={logOut}
                router={router}
            />
        );
    }
    return (
        <>
            <Button
                className={buttonCss}
                variant="outlined"
                onClick={() => {
                    logOut(false).then(() => {
                        router.replace(`/`);
                    });
                }}>
                ログアウト
            </Button>
        </>
    );
};
```

:::

### 科目管理

科目は内部で下記のように管理しています。

```typescript
// 科目の情報
// value:科目名:単位数
// label:ユーザーに表示される科目名
const japanese = [
    {
        value: '国語総合:4',
        label: '国語総合',
    },
    {
        value: '国語表現:3',
        label: '国語表現',
    },
    {
        value: '現代文A:2',
        label: '現代文A',
    },
    {
        value: '古典A:2',
        label: '古典A',
    },
];
const english = [
    {
        value: 'コミュニケーション英語1:3',
        label: 'コミュニケーション英語1',
    },
    {
        value: 'コミュニケーション英語2:4',
        label: 'コミュニケーション英語2',
    },
    {
        value: '英語表現1:2',
        label: '英語表現1',
    },
    {
        value: '英語表現2:4',
        label: '英語表現2',
    },
];
export const subjects = [...japanese, ...english].map(
    (item, index) => {
        return { ...item, index };
    },
);
```

:::details SlectComponent

```tsx
import Select from 'react-select';
import { useRecoilState } from 'recoil';
import { takingClassState } from '../../atoms/takingClassState';

const SlectComponent = ({
    subjects,
}: {
    subjects: {
        value: string;
        label: string;
        index: number;
    }[];
}) => {
    const [takingClass, setTakingClass] = useRecoilState(
        takingClassState,
    );
    return (
        <Select
            className="text-black"
            // データをロード
            defaultValue={takingClass.indexs.map((n) => subjects[n])}
            onChange={(e) => {
                // 科目は内部で、科目名:単位数、という形式で管理している
                const value = e.map((v) => v.value.split(':'));
                const indexs = e.map((v) => v.index);
                // 単位数の合計を計算
                let count = 0;
                value.forEach((v) => {
                    count += Number(v[1]);
                });
                setTakingClass({
                    value,
                    indexs,
                    count,
                });
            }}
            options={subjects}
            isClearable={true}
            isSearchable={true}
            isMulti={true}
        />
    );
};
export default SlectComponent;
```

:::

### キャッシュ機能

簡易的なキャッシュ機能です。
利用する際はfilterで検索します。

```typescript
import { useRecoilState } from 'recoil';
import { cacheState } from '../../atoms/cacheState';
import { userState } from '../atoms/userState';

const [cache, setCache] = useRecoilState(cacheState);
const user = useRecoilValue(userState);

// キャッシュ取得
const getCache = cache.filter((n) => {
    return n.id === user.uid;
});

// キャッシュに保存
setCache([
    ...cache,
    {
        id: user.uid,
        data: user,
    },
]);
```

:::details cacheState

```typescript
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();
export const cacheState = atom<
    {
        id: string;
        data: any;
    }[]
>({
    key: 'cache',
    default: [],
    effects_UNSTABLE: [persistAtom],
    dangerouslyAllowMutability: true,
});
```

:::

### データの保存と読み込み

takingClassStateというatomに科目の情報を保存しています。
takingClassStateには `0,1,2` のような数字の羅列が文字列で格納されています。
これは科目一覧配列のインデックスで、これを元にデータを復元しています。

:::details DataSaveAndLoad

```tsx
import { Button } from '@mui/material';
import {
    doc,
    getDoc,
    getFirestore,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import { cacheState } from '../../atoms/cacheState';
import loadTakingClass from '../../lib/loadTakingClass';

const NotAdminComponent = ({
    user,
    takingClass,
    setTakingClass,
}: {
    user: {
        id: string;
        uid: string;
        displayName: string;
        email: string;
        admin: boolean;
        login: boolean;
    };
    takingClass: {
        value: string[][];
        indexs: number[];
        count: number;
    };
    setTakingClass: SetterOrUpdater<{
        value: string[][];
        indexs: number[];
        count: number;
    }>;
}) => {
    // Firebaseの無料枠の上限に引っかからないように、キャッシュを使う
    const [cache, setCache] = useRecoilState(cacheState);
    return (
        <>
            <div className="flex">
                <div className="w-32">
                    <Button
                        className="w-full"
                        variant="outlined"
                        onClick={async () => {
                            const getCache = cache.filter((n) => {
                                return n.id === user.uid;
                            });
                            const takingClassData =
                                takingClass.indexs.length > 0
                                    ? takingClass.indexs.join(',')
                                    : '';

                            if (!user.admin) {
                                // キャッシュがないか、キャッシュが古い場合は、データベースからデータを取得
                                if (
                                    getCache.length === 0 ||
                                    getCache[0].data.takingClass !==
                                        takingClassData
                                ) {
                                    const db = getFirestore();
                                    const dbRef = doc(
                                        db,
                                        `users`,
                                        user.uid,
                                    );
                                    const querySnapshot = await getDoc(
                                        dbRef,
                                    );
                                    if (querySnapshot.exists()) {
                                        await updateDoc(dbRef, {
                                            takingClass: takingClassData,
                                        });
                                    } else {
                                        // データベースにデータがない場合は、データを作成
                                        await setDoc(
                                            dbRef,
                                            {
                                                userName:
                                                    user?.displayName ||
                                                    '',
                                                userId:
                                                    user?.id || '',
                                                email:
                                                    user?.email || '',
                                                takingClass: takingClassData,
                                                admin:
                                                    user?.admin ||
                                                    false,
                                                year: `${user?.id[0]}${user?.id[1]}`,
                                                uid: user?.uid || '',
                                                activeTime: 0,
                                            },
                                            { merge: true },
                                        );
                                    }
                                    const getCache = [
                                        cache.filter((n) => {
                                            return n.id === user.uid;
                                        }),
                                        cache.filter((n) => {
                                            return n.id !== user.uid;
                                        }),
                                    ];
                                    // キャッシュを更新
                                    if (getCache[0].length !== 0) {
                                        getCache[0][0].data.takingClass = takingClassData;
                                        setCache([
                                            ...getCache[0],
                                            ...getCache[1],
                                        ]);
                                    } else {
                                        // キャッシュがない場合は、キャッシュを作成
                                        setCache([
                                            ...cache,
                                            {
                                                id: user.uid,
                                                data: {
                                                    ...user,
                                                    takingClass: takingClassData,
                                                },
                                            },
                                        ]);
                                    }
                                }
                            }
                        }}>
                        保存
                    </Button>
                </div>
                <div className="w-32">
                    <Button
                        className="w-full"
                        variant="outlined"
                        onClick={async () => {
                            if (!user.admin) {
                                // キャッシュを取得
                                const getCache = cache.filter((n) => {
                                    return n.id === user.uid;
                                });
                                if (getCache.length !== 0) {
                                    // キャッシュがある場合は、キャッシュからデータを取得
                                    if (
                                        getCache[0].data?.takingClass
                                    ) {
                                        loadTakingClass({
                                            setTakingClass,
                                            takingClass:
                                                getCache[0].data
                                                    .takingClass,
                                        });
                                    }
                                } else {
                                    // キャッシュがない場合は、データベースからデータを取得
                                    const data = await getDoc(
                                        doc(
                                            getFirestore(),
                                            'users',
                                            user.uid,
                                        ),
                                    );
                                    if (data.exists()) {
                                        const user = data.data();
                                        if (user.takingClass) {
                                            // キャッシュを作成
                                            setCache([
                                                ...cache,
                                                {
                                                    id: user.uid,
                                                    data: user,
                                                },
                                            ]);
                                            // データを取得
                                            loadTakingClass({
                                                setTakingClass,
                                                takingClass:
                                                    user.takingClass,
                                            });
                                        }
                                    }
                                }
                            }
                        }}>
                        読み込み
                    </Button>
                </div>
            </div>
        </>
    );
};
export default NotAdminComponent;
```

:::

### AppCheck の導入

AppCheckは、Firebaseが提供している機能で、アプリのセキュリティを強化するための機能です。

下記のコードを用意します。

```typescript
import { initializeApp } from 'firebase/app';
import {
    getToken,
    initializeAppCheck,
    ReCaptchaV3Provider,
} from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
    ...
};
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
declare global {
    var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
}
if (typeof document !== 'undefined') {
    if (process.env.NODE_ENV === 'development') {
        window.self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(
            process.env.NEXT_PUBLIC_RECAPTCHAV3_SITE_KEY || '',
        ),
        isTokenAutoRefreshEnabled: true,
    });
    getToken(appCheck)
        .then(() => {
            console.log('AppCheck:Success');
        })
        .catch((error) => {
            console.log(error.message);
        });
}
```

`_app.tsx` にて、`AppCheck` を初期化します。

```tsx:_app.tsx
import '../modules/FirebaseApp';
```

## その他小技

### SSR 回避

ページを動的に作成する関係で、SSRができないため、SSRを無効にしています。

```tsx
const Layout = dynamic(() => import('../components/Layout'), {
    ssr: false,
});
```

### 検索時のエラー処理

先生側で生徒検索をかける際に不正なデータを入力された場合の処理です。

```tsx
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { isNumber } from 'umt/module/Math/isNumber';
import { studentState } from '../atoms/studentState';
export const SearchStudentComponent = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [student, setStudent] = useRecoilState(studentState);
    const [error, setError] = useState('');
    return (
        <>
            <TextField
                type="text"
                label="学籍番号検索"
                className="bg-white border-black border-b"
                onChange={(e) => {
                    if (
                        isNumber(e.target.value) &&
                        e.target.value.length <= 5
                    ) {
                        setStudent({
                            ...student,
                            id: e.target.value,
                        });
                    }
                    // データチェック
                    if (e.target.validity.valid) {
                        setError('');
                    } else {
                        setError(e.target.validationMessage);
                    }
                }}
                // 入力できる文字数を制限
                inputProps={{ minLength: 5, maxLength: 5 }}
                value={student.id}
            />
            {/* エラー確認 */}
            {error ? <div>{error}</div> : { children }}
        </>
    );
};
```

## 開発秘話

### データベース丸ごと変更事件

このバグのせいで2時間ほど無駄にしました。
未だに原因がわかっていません。
Realtime Databaseは本番環境だとなぜか無限ループが発生して使えないバグがありました。
Nodeのバージョンを12.Xまで下げれば解決するという記事もありましたが、
そんな古いバージョンでは他のライブラリが動かないので、Cloud Firestoreに急遽変更せざるを得ませんでした。

### 読み取り回数多すぎ事件

リリース初日に1万回も読み取りが発生しました。
1日の上限は2万回なので危なかったです。
私の学校は全校生徒100人ほどなのに、私の実装が悪く、読み取り回数が異常に多くなってしまいました。
キャッシュ機能を導入したことにより、読み取り回数は大幅に減りました。(約1万→約200回)
雑な実装は悪ですね。
Don't write bad code.

### 原因バカすぎAppCheck事件

AppCheckはreCAPTCHAで認証するのですが、なぜかエラーで認証できないというバグがありました。
これはサイトキーの最後の一文字が何故か欠落していたのが原因でした。
バカすぎですね。

### Text content does not match server-rendered HTML事件

これも私の実装が悪かったせいで発生したバグです。

```text
Unhandled Runtime Error
Error: Text content does not match server-rendered HTML.

訳: サーバー側でレンダリングされたHTMLとテキストコンテンツが一致しないぞアホ。
```

フロント側でログインしているかどうかを判定しているので、
レンダリングされた際にHTMLが変わってしまい、このエラーが発生していました。
suppressHydrationWarningを使って回避できるらしいですが、結局箇所を特定できませんでした。
仕方なくSSRを無効にして解決しました。(Nextjsの恩恵を捨ててるような気がしますがしょうがない)

## まとめ

以上、校内システムを作った話でした。
1日もかからずに作れたのは、Firebaseのおかげです。(ありがたや〜🙏)
始めはキャッシュなしでの実装だったのですが、予想以上に読み取り回数が多かったので急遽キャッシュを導入しました。
だいぶ雑な実装ですが、最低限の機能は実装できているので、まあいいかなと思っています。
(校内で先生含めNext.jsを扱える人は私しかいないので、保守が次の課題です。)

## リンク

使用したものです。

- [Firebase](https://firebase.google.com/)
- [Next.js](https://nextjs.org/)
- [Cloudflare](https://www.cloudflare.com/)
- [Recoil](https://recoiljs.org/)
- [Material-UI](https://mui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [UMT](https://github.com/riya-amemiya/UMT)

## おまけ

### 自作モジュール UMT の利用

今回は下記の機能のみを利用しました。
[UMT](https://github.com/riya-amemiya/UMT)は、自作のモジュールです。
「いつか使うかもしれない」ぐらいの頻度で使われるような機能をまとめています。

#### 数値判定

```typescript
/* isNumber(文字列 or 数値, 文字列も許可するかどうか)
 * 数値型に変換可能な場合は true を返す
 */
import { isNumber } from 'umt/module/Math/isNumber';
console.log(isNumber('123')); // true
console.log(isNumber('123a')); // false
console.log(isNumber('123', false)); // false
```
