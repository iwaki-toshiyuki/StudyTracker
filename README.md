# StudyTracker

## 本番URL
```
https://study-tracker-ten-pi.vercel.app/
```

## アプリ概要

StudyTracker は、日々の学習内容やタスクを記録し、学習状況を可視化するためのダッシュボードアプリです。

---

## 主な機能

- タスクの作成 / 編集 / 削除
- タスクの完了管理
- 学習ログの記録
- 学習時間の可視化（グラフ）
- 技術タグによる分類
- ダッシュボード表示

---

## 技術スタック

### フロントエンド

- Next.js
- React
- TypeScript
- Tailwind CSS

### ライブラリ

- Recharts（グラフ描画）
- Day.js（日付管理）

### データベース
- ローカル : Prisma（PostgreSQL）
- 本番    : Supabase

### 開発環境

- Node.js
- npm
- Git / GitHub

### ローカル環境

起動コマンド
```
npm run dev
```
ローカルURL
```
http://localhost:3000
```

Prisma確認コマンド
```
npx prisma studio
```

Prisma接続
```
// usernameは自身のユーザー名を入力する
psql postgresql://username@localhost:5432/study_tracker
```
