"use client";

import { useQuery } from "@tanstack/react-query";
import { getData } from "@/api/action";
import type { PolicyData } from "@/api/types/club/regulation";
import { POLICY, POLICY_TITLE } from "@/lib/message/policy";
import { PrintButton } from "@/components/dashboard/common/DocUtil";
import Image from "next/image";

export default function ClubPolicyTab({ clubId }: { clubId: string | null }) {
  const { data } = useQuery({
    queryKey: ["club-manage", "policy"],
    queryFn: () =>
      getData(`v1/executive/club/${clubId}/policy`, true).then(
        (res) => res.data as PolicyData
      ),
  });

  console.log("ClubPolicyTab 실행됨");
  console.log("ClubPolicyTab 에서 clubId", clubId);
  console.log("📦 data 내용:", data);

  return (
    <div className="space-y-6 p-8 rounded-2xl bg-gray-0">
      <div className="flex items-center justify-end">
        {/* <h2 className="font-semibold text-gray-900">{"동호회 상세 규정"}</h2> */}
        <PrintButton />
      </div>
      {typeof data === "string" && (
        <div className="relative w-full h-64">
          <Image
            src={data}
            alt="동호회 회칙 이미지"
            layout="fill"
            objectFit="contain"
          />
        </div>
      )}
      {/* <p className="overflow-y-auto scrollbar-custom h-full max-h-[70dvh] body-1 font-medium text-gray-700">
        <div className="mb-4 h3 font-bold">{POLICY_TITLE}</div>
        {data && data.content}
        {POLICY}
      </p> */}
      <div className="flex flex-col items-center">
        <h3 className="h3 font-bold text-gray-900">{"위와 같이 확인함."}</h3>
        <p className="mt-4 mb-2 text-gray-800 body-1 font-regular">
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <div className="relative w-40 h-16">
          <Image
            src="/signature.png"
            alt="서명"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
    </div>
  );
}
