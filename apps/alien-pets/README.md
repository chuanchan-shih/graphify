# 外來寵物 英語學院 — v0.1 prototype

遊戲化英語學習 Web App，台灣國小 4～12 歲適用。本目錄為 v0.1 前端原型（純前端 + localStorage）。

## 開發

```bash
cd apps/alien-pets
npm install
npm run dev          # http://localhost:5173
npm run build        # 產生 dist/
```

## v0.1 已實作清單

- [x] 月曆視圖 + 新增練習 Modal
- [x] 6 隻星靈 SVG 渲染（炎仔 / 水泡泡 / 草球 / 閃電鼠 / 小光球 / 影子貓）
- [x] 親密度系統（5 個等級，視覺化進度條與星星）
- [x] 飼料獲得（完成練習）與消耗（餵食）
- [x] 餵食 / 玩耍互動（含粒子特效與情緒對話）
- [x] 隨機尋寶（無 GPS，5 階稀有度加權抽，2.5 秒搜尋動畫）
- [x] 飾品收藏顯示（4×N 格子＋已穿戴管理）
- [x] 練習提醒通知（瀏覽器 Notification API：5 分鐘前 + 時間到）
- [x] 補做清單（過期 pending 自動列入）
- [x] 連勝天數計算

## 技術棧

- React 18 + Vite
- Zustand 4（含 localStorage persist）
- Tailwind CSS 3
- Framer Motion（動畫）
- date-fns（日期）

## 對應企劃書與 GDD

- 設計依據：《外來寵物 英語學院 完整產品企劃書 v1.0》
- 美術參照：《外來寵物 GDD v0.4》§4（外觀規範：大頭小身、眼旁條紋、手腕空心圓環）

## 已知限制（待 v0.2+）

- 練習題庫為 mock 樣本，每單元 1～3 題
- 無進化動畫（v0.2 計畫中）
- 無節慶活動框架（v0.2）
- 無家長儀表板（v0.3）
- 無口說評分（v0.4）
- 無 PWA / Service Worker 離線支援（v0.3）

## localStorage 重置

開瀏覽器 DevTools Console：

```js
localStorage.removeItem('alien-pets-v0.1')
location.reload()
```
