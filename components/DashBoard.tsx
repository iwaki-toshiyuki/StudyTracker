type Props = {
  overallMinutes: number;       // 全体の学習時間
  todayMinutes: number;         // 今日の学習時間
  completedTaskCount: number;   // 完了タスク数
  totalTaskCount: number;       // 総タスク数
};

export default function Dashboard({
  overallMinutes,
  todayMinutes,
  completedTaskCount,
  totalTaskCount,
}: Props) {

  // 達成率（%）
  const completionRate =
    totalTaskCount === 0
      ? 0
      // タスクがない場合は0%とする
      : Math.round((completedTaskCount / totalTaskCount) * 100);


  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">概要</h2>

      <div className="grid grid-cols-2 gap-3">

        {/* 総学習時間 */}
        <div className="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
          <p className="text-xs font-medium text-indigo-500 mb-1">総学習時間</p>
          <p className="text-2xl font-bold text-slate-800">
            {overallMinutes}
            <span className="text-sm font-normal text-slate-400 ml-1">分</span>
          </p>
        </div>

        {/* 今日の学習時間 */}
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-xs font-medium text-blue-500 mb-1">今日の学習</p>
          <p className="text-2xl font-bold text-slate-800">
            {todayMinutes}
            <span className="text-sm font-normal text-slate-400 ml-1">分</span>
          </p>
        </div>

        {/* 完了タスク */}
        <div className="p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
          <p className="text-xs font-medium text-emerald-600 mb-1">完了タスク</p>
          <p className="text-2xl font-bold text-slate-800">
            {completedTaskCount}
            <span className="text-sm font-normal text-slate-400 ml-1">/ {totalTaskCount}</span>
          </p>
        </div>

        {/* 達成率 */}
        <div className="p-4 bg-violet-50 rounded-lg border-l-4 border-violet-400">
          <p className="text-xs font-medium text-violet-500 mb-1">達成率</p>
          <p className="text-2xl font-bold text-slate-800">
            {completionRate}
            <span className="text-sm font-normal text-slate-400 ml-1">%</span>
          </p>
          <div className="mt-2 h-1.5 bg-violet-100 rounded-full overflow-hidden">
            <div
              className="h-1.5 bg-violet-400 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}