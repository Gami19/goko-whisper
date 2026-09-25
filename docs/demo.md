# 手元のデモンストレーション

PC の画面に QR を出し、同じ Wi-Fi のスマホの標準カメラで読んで、実装済みの画面を確認する。来場者の動作そのものは `user-flow.md`。公開デプロイはしない。

スマホの `localhost` はそのスマホ自身である。PC で動いているサーバーには届かない。QR に書くホストは、PC の LAN アドレスにする。

画面と `/api` は同じオリジンで出す。Vite（`localhost:5173`）と Worker（`127.0.0.1:8787`）に分けたままでは、スマホからの発行は通らない。API が CORS を返すのは `http://localhost:5173` と `http://127.0.0.1:5173` だけである。

---

## 準備

PC とスマホを、端末同士が遮断されていない同じ Wi-Fi に置く。ゲスト用 Wi-Fi では届かないことがある。

PC の LAN アドレスを見る。macOS で Wi-Fi が `en0` のときは次である。

```bash
ipconfig getifaddr en0
```

`192.168.x.x` のような値が `<LAN>` である。

フロントを、API が相対パスになるようにビルドする。`frontend/.env.local` の `VITE_API_BASE_URL=http://127.0.0.1:8787` は、そのままではビルドに焼き付く。ビルド時だけ空にする。スタンプ用トークンは `.env.local` の `VITE_STAMP_TOKEN` が入る。

```bash
cd frontend
VITE_API_BASE_URL= npm run build
```

ローカル D1 が未作成なら、先にマイグレーションを適用する。

```bash
cd backend
npx wrangler d1 migrations apply goko-whisper --local
```

Worker を、LAN から届くアドレスで起動する。秘密は `backend/.dev.vars` の `STAFF_PIN` と `ADMIN_TOKEN` が読まれる。

```bash
cd backend
npx wrangler dev --ip 0.0.0.0 --port 8787
```

---

## QR

PC の画面に、次の二つの URL の QR を出す。`<トークン>` はビルドに入った `VITE_STAMP_TOKEN` である。

| 置き場所 | URL |
|----------|-----|
| チラシ | `http://<LAN>:8787/?stamp=spot1&token=<トークン>` |
| 模擬店 | `http://<LAN>:8787/?stamp=spot2&token=<トークン>` |

このデモの QR は、URL をそのまま符号化した四角いコードである。誤り訂正 H や五高マークの入った印刷用 QR は Final で作る。

トークンを外部の QR サイトへ送らない。リポジトリのルートで、LAN アドレスと `frontend/.env.local` のトークンから PNG を作る。`qrencode` が無いときは `brew install qrencode` を先に行う。

```bash
LAN=$(ipconfig getifaddr en0)
TOKEN=$(sed -n 's/^VITE_STAMP_TOKEN=//p' frontend/.env.local)
mkdir -p /tmp/goko-demo-qr
qrencode -o /tmp/goko-demo-qr/spot1.png -s 12 -m 4 \
  "http://${LAN}:8787/?stamp=spot1&token=${TOKEN}"
qrencode -o /tmp/goko-demo-qr/spot2.png -s 12 -m 4 \
  "http://${LAN}:8787/?stamp=spot2&token=${TOKEN}"
open /tmp/goko-demo-qr
```

`-s 12` は画面に映すための大きさ、`-m 4` は周囲の余白である。Wi-Fi のアドレスが変わったら、同じコマンドで作り直す。`spot1.png` をチラシ、`spot2.png` を模擬店として画面に出す。

スマホの標準カメラで読むと、そのスマホのブラウザが URL を開く。機種が違えば保存領域も別なので、それぞれ別の参加者になる。確認する中身は `user-flow.md` のとおりである。

残数は `http://<LAN>:8787/#admin`。トークンは `.dev.vars` の `ADMIN_TOKEN`。消込の暗証番号は同じファイルの `STAFF_PIN`。

---

## この形で見えないもの

この URL は HTTP の LAN アドレスである。Service Worker は動かない。オフラインの再読み込みは、このデモでは確認しない。スタンプ、地図、食品、プレゼント、発行、消込は確認できる。
