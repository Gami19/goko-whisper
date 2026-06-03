# フォルダ分割構成｜「五高の囁き」

---

## 全体フォルダ構成

```
goko-whisper/
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts
│       ├── pages/
│       │   ├── home.ts
│       │   ├── stamp1.ts
│       │   ├── stamp2.ts
│       │   └── goal.ts
│       ├── utils/
│       │   ├── storage.ts
│       │   └── api.ts        ← バックエンドとの通信
│       └── styles/
│           ├── base.css
│           └── animations.css
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── routes/
│       │   ├── token.ts      ← ゴール認定トークン発行
│       │   └── admin.ts      ← 達成者カウント確認
│       └── utils/
│           └── token.ts      ← トークン生成ロジック
│
└── README.md
```

---

## バックエンドの役割（最小限に絞る）

DBなしで、**バックエンドがやること**は2つだけ

```
①  ゴール認定トークンの発行（スクリーンショット不正対策）
②  達成者数のカウント（当日のみのインメモリ管理）
```

---

## バックエンド技術選定

```
ランタイム  : Node.js
フレームワーク : Hono（超軽量・TypeScript native）
データ管理  : インメモリ（Map）※DBなし・1日限りのイベントなので十分
デプロイ    : Cloudflare Workers / Railway
```

### なぜHonoか

| 比較 | バンドルサイズ |
|------|-------------|
| Express | ~500KB |
| Fastify | ~300KB |
| **Hono** | **~15KB** ✅ |

---

## バックエンド実装

### `backend/package.json`

```json
{
  "name": "goko-whisper-backend",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc"
  },
  "dependencies": {
    "hono": "^4.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

### `backend/src/index.ts`

```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import { tokenRoute } from "./routes/token";
import { adminRoute } from "./routes/admin";

const app = new Hono();

// フロントエンドからのアクセスを許可
app.use("*", cors({ origin: "https://your-frontend.pages.dev" }));

app.route("/api/token", tokenRoute);
app.route("/admin",     adminRoute);

export default app;
```

---

### `backend/src/utils/token.ts`

```typescript
// シンプルなトークン生成（JWT不使用・軽量）
export type GoalToken = {
  nickname: string;
  issuedAt: number;   // UNIXタイム（ms）
  expiresAt: number;  // 5分後
  code: string;       // 4桁のランダムコード
};

// インメモリで発行済みトークンを管理
const issuedTokens = new Set<string>();

export function generateToken(nickname: string): GoalToken {
  const now = Date.now();
  const code = Math.floor(1000 + Math.random() * 9000).toString(); // 1000〜9999

  const token: GoalToken = {
    nickname,
    issuedAt: now,
    expiresAt: now + 5 * 60 * 1000, // 5分
    code,
  };

  // 使用済みトークンとして登録
  issuedTokens.add(code);
  return token;
}

export function isTokenValid(code: string): boolean {
  return issuedTokens.has(code);
}

export function consumeToken(code: string): void {
  issuedTokens.delete(code); // 一度使ったら削除（再利用不可）
}
```

---

### `backend/src/routes/token.ts`

```typescript
import { Hono } from "hono";
import { generateToken } from "../utils/token";

export const tokenRoute = new Hono();

// インメモリの達成者カウント
let goalCount = 0;

// POST /api/token/issue
// フロントからニックネームを受け取りトークンを発行
tokenRoute.post("/issue", async (c) => {
  const { nickname } = await c.req.json<{ nickname: string }>();

  if (!nickname || nickname.trim() === "") {
    return c.json({ error: "ニックネームが必要です" }, 400);
  }

  const token = generateToken(nickname.trim());
  goalCount++;

  return c.json({ token });
});
```

---

### `backend/src/routes/admin.ts`

```typescript
import { Hono } from "hono";

export const adminRoute = new Hono();

// インメモリカウントを参照
// （token.tsと共有するため、実際は外部変数化して管理）
let goalCount = 0;

export function incrementGoalCount() {
  goalCount++;
}

// GET /admin/count （スタッフのみ確認）
adminRoute.get("/count", (c) => {
  const password = c.req.header("x-admin-key");

  if (password !== process.env.ADMIN_KEY) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json({ goalCount });
});
```

---

## フロントエンド実装

### `frontend/package.json`

```json
{
  "name": "goko-whisper-frontend",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

---

### `frontend/src/utils/api.ts`

```typescript
// バックエンドとの通信をここに集約
const BASE_URL = import.meta.env.VITE_API_URL;

export type GoalToken = {
  nickname: string;
  issuedAt: number;
  expiresAt: number;
  code: string;
};

// ゴール認定トークンを取得
export async function fetchGoalToken(
  nickname: string
): Promise<GoalToken | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/token/issue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.token as GoalToken;

  } catch {
    return null;
  }
}
```

---

### `frontend/src/utils/storage.ts`

```typescript
export type StampState = {
  nickname: string;
  stamp1: { obtained: boolean; timestamp: string | null };
  stamp2: { obtained: boolean; timestamp: string | null };
};

const KEY = "goko_whisper";

const DEFAULT: StampState = {
  nickname: "",
  stamp1: { obtained: false, timestamp: null },
  stamp2: { obtained: false, timestamp: null },
};

export const Storage = {
  get: (): StampState => {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StampState) : DEFAULT;
  },

  save: (state: StampState): void => {
    localStorage.setItem(KEY, JSON.stringify(state));
  },

  setNickname: (name: string): void => {
    const s = Storage.get();
    s.nickname = name;
    Storage.save(s);
  },

  setStamp: (n: 1 | 2): void => {
    const s = Storage.get();
    s[`stamp${n}`] = {
      obtained: true,
      timestamp: new Date().toISOString(),
    };
    Storage.save(s);
  },

  hasAllStamps: (): boolean => {
    const s = Storage.get();
    return s.stamp1.obtained && s.stamp2.obtained;
  },

  clear: (): void => {
    localStorage.removeItem(KEY);
  },
};
```

---

### `frontend/src/pages/goal.ts`

```typescript
import { Storage } from "../utils/storage";
import { fetchGoalToken, GoalToken } from "../utils/api";

export async function renderGoal(container: HTMLElement) {
  const state = Storage.get();

  // スタンプ未取得なら弾く
  if (!Storage.hasAllStamps()) {
    location.hash = "#/";
    return;
  }

  // ローディング表示
  container.innerHTML = `<p class="loading">認定中...</p>`;

  // バックエンドからトークン取得
  const token = await fetchGoalToken(state.nickname);

  if (!token) {
    container.innerHTML = `<p class="error">通信エラー。スタッフにお声がけください。</p>`;
    return;
  }

  renderGoalScreen(container, token);
}

function renderGoalScreen(container: HTMLElement, token: GoalToken) {
  container.innerHTML = `
    <div class="goal-screen">
      <p class="goal-nickname">${token.nickname}</p>
      <p class="goal-code">${token.code}</p>
      <div id="timer" class="goal-timer"></div>
      <p class="goal-message">この画面をスタッフに提示してください</p>
    </div>
  `;

  // カウントダウンタイマー（スクリーンショット防止）
  startCountdown(token.expiresAt);
}

function startCountdown(expiresAt: number) {
  const timerEl = document.getElementById("timer")!;

  const interval = setInterval(() => {
    const remaining = Math.max(0, expiresAt - Date.now());
    const min = Math.floor(remaining / 60000);
    const sec = Math.floor((remaining % 60000) / 1000);

    timerEl.textContent = `有効期限：${min}:${sec.toString().padStart(2, "0")}`;

    if (remaining === 0) {
      clearInterval(interval);
      timerEl.textContent = "期限切れ　再度お試しください";
    }
  }, 1000);
}
```

---

## 環境変数の管理

```
frontend/.env
  VITE_API_URL=https://your-backend.workers.dev

backend/.env
  ADMIN_KEY=your-secret-password
```

---

## データの流れ（全体像）

```
[ユーザー]
  │
  ├─ QRコード読み取り
  │      ↓
  ├─ localStorage にスタンプ記録（バックエンド通信なし）
  │
  └─ ゴール画面
         ↓
    POST /api/token/issue   ← ここだけバックエンド通信
         ↓
    トークン（4桁コード＋カウントダウン）表示
         ↓
    スタッフが目視確認 ✅
```

---

## 次のステップ

- [ ] `npm create vite@latest frontend` でフロント初期化
- [ ] `mkdir backend && cd backend && npm init -y` でバックエンド初期化
- [ ] 環境変数の設定
- [ ] UIデザイン（アニメーション・カラー）の詳細決定

---