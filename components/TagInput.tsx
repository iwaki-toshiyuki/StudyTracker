import { useState } from "react";

// propsの型定義
type Props = {
  value: string; // 入力中の値
  onChange: (value: string) => void; // 値更新用の関数
  options: string[]; // 候補となるタグ一覧
  placeholder?: string; // プレースホルダー（任意）
};

// タグ入力コンポーネント
export default function TagInput({
  value,
  onChange,
  options,
  placeholder = "タグを入力",
}: Props) {
  // ドロップダウン表示状態
  const [isOpen, setIsOpen] = useState(false);

  // フィルタ用の検索テキスト（value とは独立して管理）
  // フォーカス時にリセットすることで、編集画面でも全タグを表示できる
  const [searchText, setSearchText] = useState("");

  return (
    <div className="relative">
      {/* 入力フィールド */}
      <input
        type="text"
        value={value} // 表示は選択済みの value を使う
        onChange={(e) => {
          onChange(e.target.value); // 親に値を渡す
          setSearchText(e.target.value); // フィルタも同期
          setIsOpen(true);
        }}
        placeholder={placeholder}
        className="flex-1 px-2 py-2 w-full"
        onFocus={() => {
          setSearchText(""); // フォーカス時にフィルタをリセット → 全件表示
          setIsOpen(true);
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
        // blurですぐ閉じるとクリックできないので少し遅らせる
      />

      {/* ドロップダウン（候補一覧） */}
      {isOpen && options.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border rounded shadow-md mt-1 z-10">

          {options
            // searchText でフィルタリング（value ではなく入力中の文字列で絞る）
            .filter((t) =>
              t.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((t) => (
              <div
                key={t}
                onMouseDown={() => {
                  onChange(t); // 候補を選択
                  setSearchText(""); // フィルタをリセット
                  setIsOpen(false); // ドロップダウン閉じる
                }}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {t}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}