# フロントエンド

## 役割

スタンプラリー体験をスマートフォン向けの **シングルページアプリ（SPA）** として提供する。

```
①  ボトムナビで「ホーム / 食品 / プレゼント」を切り替え
②  ホームタブ: ニックネーム入力後、スタンプ①②を経てゴールへ自動進行
③  ゴール画面で4桁コードとカウントダウンを表示（スタッフ確認用）
④  食品・プレゼントタブ: 模擬店・参加特典の紹介（画像は準備中）
```

現状は **React の state のみ** で画面・進行を管理している。`localStorage` への永続化やバックエンド API 呼び出しは未実装。全体の優先度は `implementation.md`、ゴール API は `backend.md`。

---

## フロントエンド技術選定

```
ランタイム      : ブラウザ（モバイルファースト）
フレームワーク   : React 19 + TypeScript
ビルドツール    : Vite 8
ルーティング    : なし（タブ・画面は Context の state で切り替え）
スタイリング    : 素の CSS（CSS 変数 + コンポーネント用クラス）
状態管理       : React Context（AppContext）
```

### なぜ React Router を使わないか

スタンプ用 QR は別ルートを増やさず、同一 URL のクエリ（`?stamp=spot1` など）で渡す。タブとホーム内画面は **Context の `activeTab` / `screen`** で切り替え、遷移アニメーションも `App.tsx` に置く。

---

## ディレクトリ構成

```
frontend/
├── index.html              # エントリ HTML（lang="ja"）
├── package.json
├── vite.config.ts
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.tsx            # React マウント
    ├── App.tsx             # タブ切り替え・ホーム内画面遷移・アニメーション
    ├── index.css           # スタイルのエントリ（@import 集約）
    ├── types/
    │   └── index.ts        # Tab, Screen, WhisperContent, GoalToken
    ├── data/
    │   └── whispers.ts     # 第一・第二の囁きテキスト
    ├── context/
    │   └── AppContext.tsx  # グローバル状態・タブ・画面遷移
    ├── pages/
    │   ├── TopPage.tsx     # トップ（ニックネーム入力）
    │   ├── StampPage.tsx   # スタンプ①②共通
    │   ├── GoalPage.tsx    # ゴール（コード・タイマー）
    │   ├── FoodPage.tsx    # 食品タブ（プレースホルダ）
    │   └── PresentPage.tsx # プレゼントタブ（プレースホルダ）
    ├── components/         # UI 部品（BottomNav 含む）
    └── styles/
        ├── variables.css   # カラー・フォント・スペーシング
        ├── base.css        # レイアウト・タイポグラフィ
        └── animations.css  # 画面遷移・囁き・ゴール演出
```

---

## タブナビゲーション

画面下部の `BottomNav` で3タブを切り替える。本番・開発とも常時表示。

| Tab       | コンポーネント  | 内容 |
|-----------|-----------------|------|
| `home`    | `ScreenRenderer` | スタンプラリー本体（`top` → `stamp1` → `stamp2` → `goal`） |
| `food`    | `FoodPage`      | 模擬店の料理紹介（画像は準備中） |
| `present` | `PresentPage`   | 参加特典の紹介（画像は準備中） |

### タブ切り替え時の挙動

- **食品・プレゼントタブへ移動した間**、ホームの `screen` はその場で停止する（自動進行タイマーをクリア）
- ホームに戻ったときは、離脱時の `screen` をそのまま表示する（自動再開はしない）
- `goal` はホームタブ内の最終画面。ゴール後もホームを開けば `GoalPage` が表示される

---

## ホーム内画面フロー

```
top ──(ニックネーム入力 + 「声を聞きに行く」)──► stamp1
                                                    │
                              800ms 後に自動遷移 ▼
                                                  stamp2
                                                    │
                              800ms 後に自動遷移 ▼
                                                   goal（最終）
```

| Screen   | コンポーネント | 主な操作 |
|----------|----------------|----------|
| `top`    | `TopPage`      | ニックネーム入力（最大20文字）→ 旅の開始 |
| `stamp1` | `StampPage`    | 第一の囁き表示（自動進行中は「声を刻む」非表示） |
| `stamp2` | `StampPage`    | 第二の囁き表示（同上） |
| `goal`   | `GoalPage`     | 4桁コード・5分カウントダウン表示 |

### 自動進行（暫定）

カメラ / QR 読み取りは未実装のため、名前入力後にホーム内フローが **800ms 間隔で連続遷移** する。

- `startHomeAutoFlow()` が `stamp1` → `stamp2` → `goal` をスケジュール
- **ホームタブ表示中のみ** タイマーが動作する
- 本番ではこの自動遷移を使わない。スタンプは標準カメラで開く URL クエリで付与する（`implementation.md`）

開発用の画面ジャンプナビは廃止し、`BottomNav` のみでタブを切り替える。

---

## 状態管理（`AppContext`）

`AppProvider` が以下を保持し、`useApp()` で各画面・コンポーネントから参照する。

| 状態 / 関数 | 説明 |
|-------------|------|
| `activeTab` | 現在のタブ（`Tab` 型: `home` / `food` / `present`） |
| `screen` | ホーム内の現在画面（`Screen` 型） |
| `nickname` | ユーザー入力名 |
| `stamp1Done` / `stamp2Done` | スタンプ取得済みフラグ |
| `autoFlowActive` | ホーム自動進行中かどうか |
| `setNickname` | ニックネーム更新 |
| `startHomeAutoFlow` | ニックネームが空でなければ自動進行を開始 |
| `completeStamp1` | スタンプ①完了 → `stamp2` へ（手動進行時） |
| `completeStamp2` | スタンプ②完了 → `goal` へ（手動進行時） |
| `setActiveTab` | タブ切り替え（ホーム以外へ移ると自動進行を停止） |
| `reset` | 全状態を初期化して `top` へ |

### ブラウザ戻るボタン

`screen` が変わるたびに `history.pushState` を実行。戻る操作（`popstate`）時は確認ダイアログを出し、OK なら `reset()` でトップに戻す。

---

## 主要ファイル

### `frontend/package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.6",
    "react-dom": "^19.2.6"
  }
}
```

---

### `frontend/src/types/index.ts`

```typescript
export type Tab = "home" | "food" | "present";

export type Screen = "top" | "stamp1" | "stamp2" | "goal";

export type WhisperContent = {
  label: string;
  text: string;
  hint: string;
};

export type GoalToken = {
  code: string;
  expiresAt: number;
};
```

---

### `frontend/src/data/whispers.ts`

スタンプ①②で表示するコピーを静的データとして定義。文言の変更はこのファイルのみで完結する。

```typescript
export const WHISPERS: Record<1 | 2, WhisperContent> = {
  1: { label: "第一の囁き", text: "...", hint: "..." },
  2: { label: "第二の囁き", text: "...", hint: "..." },
};
```

---

### `frontend/src/App.tsx`

- `TabContent` が `activeTab` に応じてホーム / 食品 / プレゼントを描画
- `ScreenRenderer` がホーム内の `screen` に応じてページコンポーネントを描画
- 画面変更時に **exit（400ms）→ enter（400ms）** のフェード＋スライド遷移
- `BottomNav` を画面下部に常時表示

---

### `frontend/src/pages/GoalPage.tsx`

ゴール画面。現状は **フロントエンド単体** でトークンを生成している。

```typescript
function generateCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

// useState の初期化関数で1回だけ生成（5分有効）
const [token] = useState(() => ({
  code: generateCode(),
  expiresAt: Date.now() + 5 * 60 * 1000,
}));
```

バックエンド接続時は、この生成処理を `POST /api/token/issue` のレスポンスに差し替える。契約は `backend.md`。

---

## コンポーネント一覧

| コンポーネント | 役割 |
|----------------|------|
| `BottomNav` | 本番用ボトムナビ（ホーム / 食品 / プレゼント） |
| `PageLayout` | 各画面の `<main>` ラッパー。`variant` で背景・余白を切り替え |
| `DividerLine` | 区切り線（solid / dashed / primary） |
| `TextButton` | テキストボタン。タップ時に短いバイブレーション（対応端末のみ） |
| `WhisperReveal` | 囁きテキストのブラー→鮮明アニメーション（`primary` / `glow`） |
| `StampEffect` | スタンプ押印演出（オーバーレイ光 + 「刻まれた」表示）。完了後 `onComplete` |
| `CodeDisplay` | 4桁コードを1桁ずつ表示（デフォルト3秒遅延後に開始） |
| `CountdownTimer` | 残り時間表示。2分以下で warning、1分以下で critical |
| `MemorialSilhouette` | 五高記念館風の SVG シルエット（ゴール画面） |

### `StampEffect` のタイミング（手動進行時）

```
「声を刻む」タップ
  → バイブレーション 300ms
  → 5秒後に「刻まれた」表示
  → さらに 2.3秒後に onComplete（次画面へ）
```

自動進行時は `StampEffect` は使わず、Context のタイマーで画面を切り替える。

---

## スタイリング

`index.css` から3ファイルを `@import` する構成。

| ファイル | 内容 |
|----------|------|
| `variables.css` | ダーク紫基調のカラーパレット、明朝・ゴシックフォント、`--max-width: 480px`、`--bottom-nav-height` |
| `base.css` | リセット、`.page-layout--*` ごとの背景グラデーション、ボトムナビ、フォーム・ボタン |
| `animations.css` | ページ遷移、囁き出現、スタンプ、ゴール要素の段階表示 |

デザイン方針: **モバイル縦画面・最大幅480px・中央寄せ**。ホームはスクロール抑制（`body { overflow: hidden }`）。食品・プレゼントタブは `.tab-content` 内で縦スクロール可能（将来の画像掲載を想定）。

---

## 開発コマンド

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ に静的ビルド
npm run preview  # ビルド成果物のプレビュー
```

- 画面下部の `BottomNav` でタブを切り替えられる

---

## 実装予定（フロント）

優先度の全体は `implementation.md`。ここではクライアント側の変更だけを書く。

永続化する形はこれだけにする。同期は `AppContext` の中で行う。別フックに分けると、起動時の復元と URL マージの順序が割れやすい。

```ts
interface StampRallyState {
  nickname: string;
  stamp1Done: boolean;
  stamp2Done: boolean;
  redeemed: boolean;
  rewardCode?: string;
  issuedAt?: number;
}
```

起動順序:

1. `localStorage` を読む。
2. クエリの `stamp=spot1|spot2` を、トークンが一致するときだけマージして保存する。
3. `history.replaceState` でクエリを落とす。今の `AppContext` は画面が変わるたびに `history.pushState(..., window.location.pathname)` しており、クエリを残すと戻る操作と競合する。クエリは一度だけ適用する入場券にする。
4. 画面を決める。両方のスタンプがあり未引換ならゴール。①だけなら模擬店への案内。引換済みなら引換済み画面。囁きの演出は、そのスタンプを初めて付けたときだけ再生する。

`reset()`（戻る操作で旅を中断）は、このキーも消す。

ゴール画面は、未発行なら `POST /api/token/issue` を呼び、返ったコードを `rewardCode` に保存して再表示する。スタッフ確認は同じ画面に置き、PIN とともに `POST /api/token/verify` を呼ぶ。成功後に引換済み画面へ切り替える。API の形は `backend.md`。

食品・プレゼントの画像とイラストマップ、Service Worker の事前キャッシュは `implementation.md` の「オフラインと画像」。

---
