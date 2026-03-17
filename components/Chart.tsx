"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// 色の定義
const COLORS = [
  "#6366f1", // インディゴ（青系・メイン）
  "#22c55e", // グリーン（成功・成長）
  "#f59e0b", // アンバー（注意・中間）
  "#ef4444", // レッド（強調）
  "#8b5cf6", // パープル（補助）
  "#06b6d4", // シアン（アクセント）
];

// props型
type Props = {
  data: { name: string; value: number }[];
};

export default function Chart({ data }: Props) {

  return (


    <PieChart width={300} height={300}>

      {/* 円グラフ */}
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        outerRadius={100}
      >
        {data.map((_, index) => (
          <Cell key={index} 
          fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>

      {/* ホバーで詳細 */}
      <Tooltip />

      {/* 凡例 */}
      <Legend />

    </PieChart>

  );
}