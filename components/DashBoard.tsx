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

    // カードレイアウト（2列）
    <div className="grid grid-cols-2 gap-4 mb-6">

      {/* 全体学習時間 */}
      <div className="bg-blue-100 p-4 rounded">
        <p className="text-sm">総学習時間</p>
        <p className="text-xl font-bold">{overallMinutes} 分</p>
      </div>

      {/* 今日の学習時間 */}
      <div className="bg-green-100 p-4 rounded">
        <p className="text-sm">今日の学習時間</p>
        <p className="text-xl font-bold">{todayMinutes} 分</p>
      </div>

      {/* 完了タスク */}
      <div className="bg-yellow-100 p-4 rounded">
        <p className="text-sm">完了タスク</p>
        <p className="text-xl font-bold">
          {completedTaskCount} / {totalTaskCount}
        </p>
      </div>

      {/* 達成率 */}
      <div className="bg-purple-100 p-4 rounded">
        <p className="text-sm">達成率</p>
        <p className="text-xl font-bold">{completionRate}%</p>
      </div>

    </div>
  );
}