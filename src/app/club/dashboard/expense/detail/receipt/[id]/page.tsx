"use client";

import Link from "next/link";
import BackButton from "@/components/dashboard/common/BackButton";
import DocUtilButtons from "@/components/dashboard/common/DocUtil";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/Skeleton";

const PDFViewer = dynamic(
  () => import("@/components/dashboard/club/common/PDFViewer"),
  { ssr: false, loading: () => <Skeleton className="w-full h-[1080px]" /> }
);

interface Props {
  params: { id: string };
}

export default function ExpenseReceiptDetailPage({ params }: Props) {
  return (
    <>
      <BackButton />
      <div className="p-8 rounded-xl bg-gray-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="h3 font-semibold text-gray-900">{"영수증"}</h2>
          <DocUtilButtons />
        </div>
        <PDFViewer file="../../../../../sample.pdf" />
      </div>
    </>
  );
}
