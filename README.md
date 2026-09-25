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