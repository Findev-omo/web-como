"use client";

import { HiOutlineExclamationCircle } from "react-icons/hi2";
import toast from "react-hot-toast";
import { closeModal } from "@/lib/utils";
import Backdrop from "@/components/common/Backdrop";
import Button from "@/components/common/Button";

export default function DeletePictureModal() {
  const handleDelete = () => {
    // TODO: api 연동
    closeModal("delete-picture");
    toast.success("사진이 삭제되었습니다.");
  };

  return (
    <div id="delete-picture" className="hidden modal">
      <Backdrop />
      <div className="flex flex-col items-center gap-6 absolute bottom-1/2 right-1/2 translate-y-1/2 translate-x-1/2 z-40 space-y-8 p-8 rounded-xl bg-gray-0 shadow">
        <HiOutlineExclamationCircle className="w-16 h-16 text-red-500" />
        <p className="body-1 text-gray-900">사진을 삭제하시겠습니까?</p>
        <div className="flex gap-2">
          <Button
            content="취소"
            onClick={() => closeModal("delete-picture")}
            className="w-32"
          />
          <Button
            content="삭제"
            onClick={handleDelete}
            primary
            className="w-32"
          />
        </div>
      </div>
    </div>
  );
}
