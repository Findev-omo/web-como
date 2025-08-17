"use client";

import { useState, useEffect } from "react";
import { closeModal } from "@/lib/utils";
import Backdrop from "@/components/common/Backdrop";
import Button from "@/components/common/Button";
import { Close } from "@/assets/icons/action";
import { useDeleteEmployee } from "@/hooks/queries/company";
import toast from "react-hot-toast";

export default function DeleteEmployeeModal() {
  const [modalParams, setModalParams] = useState<any>(null);
  const deleteEmployeeMutation = useDeleteEmployee();

  useEffect(() => {
    const modal = document.getElementById("employee-delete");
    if (modal) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "data-modal-params"
          ) {
            const newParams = modal.dataset.modalParams;
            if (newParams) {
              setModalParams(JSON.parse(newParams));
            }
          }
        });
      });

      observer.observe(modal, {
        attributes: true,
        attributeFilter: ["data-modal-params"],
      });

      return () => observer.disconnect();
    }
  }, []);

  const handleDelete = async () => {
    if (!modalParams?.memberId) return;

    try {
      await deleteEmployeeMutation.mutateAsync(modalParams.memberId);
      toast.success("직원이 성공적으로 삭제되었습니다.");
      closeModal("employee-delete");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      toast.error(`직원 삭제 중 오류가 발생했습니다: ${errorMessage}`);
    }
  };

  return (
    <div id="employee-delete" className="hidden modal">
      <Backdrop />
      <div className="fixed bottom-1/2 right-1/2 translate-y-1/2 translate-x-1/2 z-50 w-full max-w-[400px] p-4 rounded-xl bg-gray-0 shadow">
        <div className="space-y-6 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-center h2 font-bold text-gray-900">
              {"회원 삭제"}
            </h2>
            <button onClick={() => closeModal("employee-delete")}>
              <Close className="w-8 h-8" />
            </button>
          </div>
          <p className="text-center body-1 text-gray-600">
            {"정말 이 회원을 삭제하시겠습니까?"}
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              content="취소"
              onClick={() => closeModal("employee-delete")}
              disabled={deleteEmployeeMutation.isPending}
            />
            <Button
              primary
              content={deleteEmployeeMutation.isPending ? "삭제 중..." : "삭제"}
              onClick={handleDelete}
              disabled={deleteEmployeeMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
