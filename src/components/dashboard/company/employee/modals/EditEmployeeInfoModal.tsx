"use client";

import { useState, useEffect } from "react";
import { closeModal } from "@/lib/utils";
import Backdrop from "@/components/common/Backdrop";
import Input, { InputLabel } from "@/components/common/Input";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";
import { Close } from "@/assets/icons/action";
import { useUpdateEmployee } from "@/hooks/queries/company";
import { getData } from "@/api/action";
import toast from "react-hot-toast";

export default function EditEmployeeInfoModal() {
  const [modalParams, setModalParams] = useState<any>(null);
  const [memberData, setMemberData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    position: "",
    email: "",
  });
  const [role, setRole] = useState<
    "MEMBER" | "EXECUTIVE" | "MANAGER" | "ADMIN"
  >("MEMBER");

  const updateEmployeeMutation = useUpdateEmployee();

  useEffect(() => {
    const modal = document.getElementById("employee-edit");
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

  useEffect(() => {
    const loadMemberData = async () => {
      if (!modalParams?.memberId) return;

      try {
        const res = await getData(
          `v1/manager/member/${modalParams.memberId}`,
          true
        );
        setMemberData(res.data);
        setRole(res.data.role || "MEMBER");
      } catch (error) {
        console.error("직원 정보 로딩 오류:", error);
        toast.error("직원 정보를 불러오는데 실패했습니다.");
      }
    };

    loadMemberData();
  }, [modalParams]);

  useEffect(() => {
    if (memberData) {
      setFormData({
        name: memberData.name || "",
        department: memberData.department || "",
        position: memberData.position || "",
        email: memberData.email || "",
      });
    }
  }, [memberData]);

  const handleClose = () => {
    const modal = document.getElementById("employee-edit");
    if (modal) {
      delete modal.dataset.modalParams;
    }
    closeModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!modalParams?.memberId) return;

    try {
      const submitData = {
        ...formData,
        role: role,
      };

      await updateEmployeeMutation.mutateAsync({
        memberId: modalParams.memberId,
        data: submitData,
      });

      toast.success("직원 정보가 성공적으로 수정되었습니다.");
      closeModal("employee-edit");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      toast.error(`직원 정보 수정 중 오류가 발생했습니다: ${errorMessage}`);
    }
  };

  if (!memberData) {
    return (
      <div id="employee-edit" className="hidden modal">
        <Backdrop />
        <div className="fixed bottom-1/2 right-1/2 translate-y-1/2 translate-x-1/2 z-50 w-full max-w-[600px] p-4 rounded-xl bg-gray-0 shadow">
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-600">직원 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="employee-edit" className="hidden modal">
      <Backdrop />
      <div className="fixed bottom-1/2 right-1/2 translate-y-1/2 translate-x-1/2 z-50 w-full max-w-[600px] p-4 rounded-xl bg-gray-0 shadow">
        <div className="space-y-6 h-full max-h-screen overflow-y-auto p-4 scrollbar-custom">
          <div className="flex items-center justify-between">
            <h2 className="text-center h1 font-bold text-gray-900">
              {"회원 정보 수정"}
            </h2>
            <button onClick={handleClose}>
              <Close className="w-8 h-8" />
            </button>
          </div>
          <div className="space-y-4">
            <Input
              id="name"
              label="이름"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              id="department"
              label="부서"
              value={formData.department}
              onChange={handleChange}
            />
            <Input
              id="position"
              label="직책"
              value={formData.position}
              onChange={handleChange}
            />
            <Input
              id="email"
              type="email"
              label="이메일 주소"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-3">
            <InputLabel label="권한 부여" />
            <Checkbox
              name="member"
              content="권한 없음"
              checked={role === "MEMBER"}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.checked) {
                  setRole("MEMBER");
                }
              }}
            />
            <Checkbox
              name="executive"
              content="동호회 관리자 권한"
              checked={
                role === "EXECUTIVE" || role === "MANAGER" || role === "ADMIN"
              }
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.checked) {
                  setRole("EXECUTIVE");
                } else {
                  setRole("MEMBER");
                }
              }}
            />
          </div>
          <Button
            primary
            content={
              updateEmployeeMutation.isPending ? "수정 중..." : "수정하기"
            }
            onClick={handleSubmit}
            disabled={updateEmployeeMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
