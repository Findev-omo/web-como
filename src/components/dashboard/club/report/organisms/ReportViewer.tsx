import dynamic from "next/dynamic";
import Skeleton from "@/components/common/Skeleton";

const PDFViewer = dynamic(
  () => import("@/components/dashboard/club/common/PDFViewer"),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[1080px]" />,
  }
);

export default function ReportViewer() {
  return <PDFViewer file={"../../../../sample.pdf"} />;
}
