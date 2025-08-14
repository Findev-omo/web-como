"use client";

import { useState, useEffect } from "react";
import { useAutoSave } from "@/hooks/useAutoSave";
import { UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";
import { Checked } from "@/assets/icons/checkbox";

interface Props {
  handleRestore?: () => void;
  clearSavedData?: () => Promise<void>;
}

export function AutoSaveRestoreAlert({ handleRestore, clearSavedData }: Props) {
  const handleConfirmRestore = () => {
    if (handleRestore) {
      handleRestore();
      toast.success("작성중인 내용을 복원했습니다.");
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
            onClick={clearSavedData}
            className="flex-1 font-bold text-xl text-[#ffffff] bg-[#FD7E2D] py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            무시하기
          </button>
          <button
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
