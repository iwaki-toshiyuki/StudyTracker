"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// グラフで使う色の一覧
const COLORS = [
  "#6366f1", // インディゴ（青系・メイン）
  "#22c55e", // グリーン（成功・成長）
  "#f59e0b", // アンバー（注意・中間）
  "#ef4444", // レッド（強調）
  "#8b5cf6", // パープル（補助）
  "#06b6d4", // シアン（アクセント）
];

// props型
// data: 累計学習時間（棒グラフ用）
// todayData: 今日の学習時間（円グラフ用）
type Props = {
  data: { name: string; value: number }[];
  todayData: { name: string; value: number }[];
};

export default function Chart({ data, todayData }: Props) {

  return (
    <div>

      {/* ===== 今日の学習割合（円グラフ） ===== */}
      <h2 className="text-lg font-bold mt-6 mb-2 text-center">今日の学習割合</h2>

      {/* 今日のデータがない場合はメッセージを表示 */}
      {todayData.length === 0 ? (
        <p className="text-center text-gray-400 text-sm mb-4">今日の学習記録がありません</p>
      ) : (
        <PieChart width={300} height={280}>

          {/* 円グラフ本体 */}
          <Pie
            data={todayData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
          >
            {/* 各スライスに色を割り当てる */}
            {todayData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          {/* ホバーで詳細表示（valueはundefinedの可能性があるため ?? で安全に表示） */}
          <Tooltip formatter={(value) => `${value ?? 0} 分`} />

          {/* 凡例 */}
          <Legend />

        </PieChart>
      )}

      {/* ===== 累計学習時間（棒グラフ） ===== */}
      <h2 className="text-lg font-bold mt-4 mb-2 text-center">累計学習時間</h2>

      {/* 累計データがない場合はメッセージを表示 */}
      {data.length === 0 ? (
        <p className="text-center text-gray-400 text-sm mb-4">学習記録がありません</p>
      ) : (
        <BarChart width={300} height={250} data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>

          {/* 背景のグリッド線 */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* X軸：タグ名 */}
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />

          {/* Y軸：分数 */}
          <YAxis tick={{ fontSize: 12 }} />

          {/* ホバーで詳細表示（valueはundefinedの可能性があるため ?? で安全に表示） */}
          <Tooltip formatter={(value) => `${value ?? 0} 分`} />

          {/* 棒グラフ本体：各タグごとに色を変える */}
          <Bar dataKey="value" name="学習時間（分）" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>

        </BarChart>
      )}

    </div>
  );
}