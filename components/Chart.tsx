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
  ResponsiveContainer,
} from "recharts";

// グラフで使う色の一覧（ネイビー・ブルー系で統一）
const COLORS = [
  "#1e40af", // ディープブルー
  "#3b82f6", // ブルー
  "#60a5fa", // ライトブルー
  "#1d4ed8", // ネイビー
  "#6366f1", // インディゴ
  "#93c5fd", // ペールブルー
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">

      {/* ===== 今日の学習割合（円グラフ） ===== */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">今日の学習割合</h2>
        {todayData.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">今日の学習記録がありません</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={todayData}
                dataKey="value"
                nameKey="name"
                outerRadius={75}
                strokeWidth={0}
              >
                {todayData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value ?? 0} 分`}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              />
              <Legend iconSize={10} wrapperStyle={{ fontSize: "11px" }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ===== 累計学習時間（棒グラフ） ===== */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">累計学習時間</h2>
        {data.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">学習記録がありません</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value) => `${value ?? 0} 分`}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              />
              <Bar dataKey="value" name="学習時間（分）" radius={[4, 4, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}