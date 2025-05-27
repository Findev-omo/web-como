"use client";

import Image from "next/image";

const Data = {
  title: "testst",
  writer: "testes",
  views: 30,
  date: [2024, 3, 1],
  image: "/logo.png",
  detail:
    "올해 첫 중증열성혈소판감소증후군(Severe Fever with Thrombocytopenia Syndrome, 이하 SFTS) 환자가 경북 상주에서 발생한 가운데 농작업과 야외활동 때 각별한 주의가 요구된다.경북도에 따르면 상주에 거주하는 60대 여성 A씨는 4월초순 과수원에서 농작업을 했고, 16일 식욕부진으로 인근 병원에서 진료받았지만 이후에도 발열 증상이 있어 19일 도내 의료기관에 입원했다. 올해 첫 중증열성혈소판감소증후군(Severe Fever with Thrombocytopenia Syndrome, 이하 SFTS) 환자가 경북 상주에서 발생한 가운데 농작업과 야외활동 때 각별한 주의가 요구된다.경북도에 따르면 상주에 거주하는 60대 여성 A씨는 4월초순 과수원에서 농작업을 했고, 16일 식욕부진으로 인근 병원에서 진료받았지만 이후에도 발열 증상이 있어 19일 도내 의료기관에 입원했다. 올해 첫 중증열성혈소판감소증후군(Severe Fever with Thrombocytopenia Syndrome, 이하 SFTS) 환자가 경북 상주에서 발생한 가운데 농작업과 야외활동 때 각별한 주의가 요구된다.경북도에 따르면 상주에 거주하는 60대 여성 A씨는 4월초순 과수원에서 농작업을 했고, 16일 식욕부진으로 인근 병원에서 진료받았지만 이후에도 발열 증상이 있어 19일 도내 의료기관에 입원했다.",
};

export default function NotificationDetailComponent() {
  return (
    <div className="flex w-full p-[32px] flex-col  rounded-xl bg-gray-0 max-w-[1620px]">
      <span className="font-[600] text-2xl mb-[24px]">공지사항</span>
      <div className="flex flex-col">
        <div className="flex border-b border-t  border-gray-400">
          <span className="max-w-[120px] w-full bg-gray-200 py-[12px] text-base font-bold  pl-[24px]">
            제목
          </span>
          <span className="flex-1 min-w-0 w-full truncate py-[12px] pl-[24px] text-base">
            {Data.title}
          </span>
        </div>
        <div className="flex border-b   border-gray-400">
          <span className="max-w-[120px] w-full bg-gray-200 py-[12px] text-base font-bold  pl-[24px]">
            작성자
          </span>
          <span className="flex-1 min-w-0 w-full truncate py-[12px] pl-[24px] text-base">
            {Data.writer}
          </span>
        </div>
        <div className="flex border-b  border-gray-400">
          <span className="max-w-[120px] w-full bg-gray-200 py-[12px] text-base font-bold  pl-[24px]">
            작성일자
          </span>
          <span className="flex-1 min-w-0 w-full truncate py-[12px] pl-[24px] text-base">
            {Data.date}
          </span>
        </div>
        <div className="flex border-b  border-gray-400">
          <span className="max-w-[120px] w-full bg-gray-200 py-[12px] text-base font-bold  pl-[24px]">
            조회수
          </span>
          <span className="flex-1 min-w-0 w-full truncate py-[12px] pl-[24px] text-base">
            {Data.views}
          </span>
        </div>
      </div>
      <div className="flex flex-col py-[32px] text-base border-b-2 border-gray-500">
        {Data.image && (
          <div className=" relative max-w-[350px] aspect-[1/1] mb-[24px]">
            <Image
              fill
              src={Data.image}
              alt="image"
              className="rounded-[8px]"
            />
          </div>
        )}
        <span>{Data.detail}</span>
      </div>
    </div>
  );
}
