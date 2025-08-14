"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  handleRestore?: () => void | Promise<void>;
  clearSavedData?: () => Promise<void>;
}

export function AutoSaveRestoreAlert({ handleRestore, clearSavedData }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  const handleConfirmRestore = async () => {
    try {
      if (handleRestore) {
        await handleRestore();
        toast.success("작성중인 내용을 복원했습니다.");
      }
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-[#ffffff] border border-[#FD7E2D] rounded-2xl p-8 shadow-xl max-w-lg backdrop-blur-sm">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-sm">
          저장된 데이터가 있습니다
        </h3>

        <p className="text-lg text-white/95 mb-6 leading-relaxed drop-shadow-sm">
          이전에 작성 중이던 내용을 복원하시겠습니까?
        </p>

        <div className="flex gap-4 w-full">
          <button
            type="button"
            onClick={async () => {
              try {
                await clearSavedData?.();
              } finally {
                setIsOpen(false);
              }
            }}
            className="flex-1 font-bold text-xl text-[#ffffff] bg-[#FD7E2D] py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            무시하기
          </button>
          <button
            type="button"
            onClick={handleConfirmRestore}
            className="flex-1 text-xl font-bold bg-white text-[#FD7E2D] py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            복원하기
          </button>
        </div>
      </div>
    </div>
  );
}
