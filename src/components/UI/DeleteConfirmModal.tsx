// src/components/UI/DeleteConfirmModal.tsx
import React, { useEffect } from 'react';

interface DeleteConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  title = '삭제하기',
  description = '삭제된 글은 복구할 수 없습니다.',
  onCancel,
  onConfirm,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[999] bg-black/40" onClick={onCancel} />
      <div className="fixed inset-0 z-[1000] flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-500 mb-6">{description}</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onCancel}
              className="h-12 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              className="h-12 rounded-lg bg-[#FF6A33] text-white hover:opacity-90 transition-opacity"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmModal;