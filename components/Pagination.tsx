// ページネーションコンポーネントのProps定義
type Props = {
  page: number; // 現在のページ番号
  total: number; // 全データ件数（DBから取得）
  limit: number; // 1ページあたりの表示件数
  onPageChange: (page: number) => void; // ページ変更時の関数
};

export default function Pagination({
  page,
  total,
  limit,
  onPageChange,
}: Props) {

  // 🔥 総ページ数を計算
  // total（全件数）÷ limit（1ページ件数）
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex justify-center items-center gap-4 mt-4">

      {/* 🔽 前へボタン */}
      <button
        disabled={page === 1} // 1ページ目なら押せない
        onClick={() => onPageChange(page - 1)} // 前のページへ
        className="px-3 py-1 border rounded disabled:opacity-30"
      >
        前へ
      </button>

      {/* 🔢 現在ページ / 総ページ */}
      <span className="text-sm">
        {page} / {totalPages}
      </span>

      {/* 🔼 次へボタン */}
      <button
        disabled={page >= totalPages} // 最後のページなら押せない
        onClick={() => onPageChange(page + 1)} // 次のページへ
        className="px-3 py-1 border rounded disabled:opacity-30"
      >
        次へ
      </button>

    </div>
  );
}