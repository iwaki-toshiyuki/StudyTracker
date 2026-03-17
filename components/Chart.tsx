"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// 色の定義
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c"];

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