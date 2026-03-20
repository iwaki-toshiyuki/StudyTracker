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

  return (
    <div className="relative">
      {/* 入力フィールド */}
      <input
        type="text"
        value={value} // 入力値を表示
        onChange={(e) => {
          onChange(e.target.value); // 親に値を渡す
          setIsOpen(true); // 入力したら候補を表示
        }}
        placeholder={placeholder}
        className="flex-1 px-2 py-2"
        onFocus={() => setIsOpen(true)} // フォーカスで開く
        onBlur={() => setTimeout(() => setIsOpen(false), 100)} 
        // blurですぐ閉じるとクリックできないので少し遅らせる
      />

      {/* ドロップダウン（候補一覧） */}
      {isOpen && options.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border rounded shadow-md mt-1 z-10">

          {options
            // 入力内容でフィルタリング（部分一致）
            .filter((t) =>
              t.toLowerCase().includes(value.toLowerCase())
            )
            .map((t) => (
              <div
                key={t} // 一意のキー
                onMouseDown={() => {
                  onChange(t); // 候補を選択
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