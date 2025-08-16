"use client";

import { useState, useEffect } from "react";
import { useAutoSave } from "@/hooks/useAutoSave";
import { UseFormReturn } from "react-hook-form";
import toast from "react-hot-toast";
import { Checked } from "@/assets/icons/checkbox";

interface Props {
  handleRestore?: () => void;
  clearSavedData?: () => Promise<void>;
  hasSavedData?: boolean;
}

export function AutoSaveRestoreAlert({
  handleRestore,
  clearSavedData,
  hasSavedData = false,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(hasSavedData);
  }, [hasSavedData]);

  const handleConfirmRestore = () => {
    if (handleRestore) {
      handleRestore();
      setIsVisible(false);
      toast.success("작성중인 내용을 복원했습니다.");
    }
  };

  const handleClearData = async () => {
    if (clearSavedData) {
      try {
        await clearSavedData();
        setIsVisible(false);
        toast.success("저장된 데이터를 삭제했습니다.");
      } catch (error) {
        toast.error("데이터 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-[#ffffff] border border-[#FD7E2D] rounded-2xl p-8 shadow-xl max-w-lg backdrop-blur-sm">
      <div className="flex flex-col items-center text-center">
        <h3 className="text-2xl font-bold text-[#FD7E2D] mb-4">
          저장된 데이터가 있습니다
        </h3>

        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          이전에 작성 중이던 내용을 복원하시겠습니까?
        </p>

        <div className="flex gap-4 w-full">
          <button
            onClick={handleClearData}
            className="flex-1 font-bold text-xl text-white bg-[#FD7E2D] py-3 px-6 rounded-xl hover:bg-[#e66a1f] transition-colors shadow-sm"
          >
            무시하기
          </button>
          <button
            onClick={handleConfirmRestore}
            className="flex-1 text-xl font-bold bg-white text-[#FD7E2D] py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors shadow-sm border border-[#FD7E2D]"
          >
            복원하기
          </button>
        </div>
      </div>
    </div>
  );
}
