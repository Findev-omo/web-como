"use client";

import Image from "next/image";
import { closeModal } from "@/lib/utils";
import KakaoButton from "@/assets/images/kakaotalk_sharing_btn_medium.svg";

export default function CustomerCenter() {
  return (
    <div id="customer-center" className="modal hidden">
      <div
        className="fixed inset-0 z-30 cursor-pointer"
        onClick={() => closeModal()}
      ></div>
      <div className="fixed bottom-1/2 right-1/2 translate-y-1/2 translate-x-1/2 z-50 flex items-center justify-center">
        <div
          className="space-y-8 w-full max-w-[452px] p-8 rounded-xl bg-gray-0 shadow"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative flex items-center justify-center h-9">
            <h1 className="font-bold text-gray-900">고객센터 문의</h1>
            <div
              className="absolute top-0 right-0 cursor-pointer"
              onClick={() => closeModal()}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-900"
              >
                <g clipPath="url(#clip0_3483_43383)">
                  <path
                    d="M27.4501 8.56508C26.8651 7.98008 25.9201 7.98008 25.3351 8.56508L18.0001 15.8851L10.6651 8.55008C10.0801 7.96508 9.13508 7.96508 8.55008 8.55008C7.96508 9.13508 7.96508 10.0801 8.55008 10.6651L15.8851 18.0001L8.55008 25.3351C7.96508 25.9201 7.96508 26.8651 8.55008 27.4501C9.13508 28.0351 10.0801 28.0351 10.6651 27.4501L18.0001 20.1151L25.3351 27.4501C25.9201 28.0351 26.8651 28.0351 27.4501 27.4501C28.0351 26.8651 28.0351 25.9201 27.4501 25.3351L20.1151 18.0001L27.4501 10.6651C28.0201 10.0951 28.0201 9.13508 27.4501 8.56508Z"
                    fill="currentColor"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_3483_43383">
                    <rect width="36" height="36" fill="white"></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div className="text-center">
            <button
              className="mx-auto"
              onClick={() => {
                // 카카오톡 채널 링크로 이동
                window.open("https://open.kakao.com/o/s1t61zah", "_blank");
                // 모달 닫기
                closeModal();
              }}
            >
              <Image
                src={KakaoButton}
                alt="카카오톡"
                width={64}
                height={64}
                className="mx-auto"
              />
              <div className="mt-2 text-center body-1 font-bold text-gray-900">
                <span className="font-poppins">omo</span>
                <div>카카오톡 채널</div>
              </div>
            </button>
          </div>
          <div className="p-4 rounded-lg border border-gray-300">
            <div className="h4 font-bold text-gray-900">운영시간</div>
            <div className="mt-2 h4 font-normal text-gray-800">
              평일 10:00~17:00 (점심 12:00~13:00)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
