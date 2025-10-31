// src/components/UI/PostActionMenu.tsx
import React, { useEffect } from 'react';

interface PostActionMenuProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  className?: string; // 위치 커스터마이즈용 (optional)
}

const PostActionMenu: React.FC<PostActionMenuProps> = ({ open, onClose, onEdit, onDelete, className = '' }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* 바깥 영역 클릭 닫힘 */}
      <div className="fixed inset-0 z-40 bg-black/0" onClick={onClose} aria-hidden="true" />
      {/* 메뉴 카드 */}
      <div className={`fixed z-50 right-4 top-14 w-44 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100 ${className}`}>
        <button
          onClick={onEdit}
          className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50"
        >
          수정하기
        </button>
        <div className="h-px bg-gray-200" />
        <button
          onClick={onDelete}
          className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50"
        >
          삭제하기
        </button>
      </div>
    </>
  );
};

export default PostActionMenu;