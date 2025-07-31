import DashboardOverview from "@/components/dashboard/company/main/molecules/Overview";
import SpendingFigures from "@/components/dashboard/company/main/organisms/SpendingFigures";
import Announcement from "@/components/dashboard/company/main/organisms/Announcement";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/Skeleton";

const PurchaseStats = dynamic(
  () => import("@/components/dashboard/company/main/organisms/PurchaseStats"),
  { ssr: false, loading: () => <Skeleton className="w-full h-[540px]" /> }
);

const ClubStats = dynamic(
  () => import("@/components/dashboard/company/main/organisms/ClubStats"),
  { ssr: false, loading: () => <Skeleton className="w-full h-[540px]" /> }
);

const ShopStats = dynamic(
  () => import("@/components/dashboard/company/main/organisms/ShopStats"),
  { ssr: false, loading: () => <Skeleton className="w-full h-[548px]" /> }
);

export default function DashboardPage() {
  return (
    <section className="flex flex-col gap-3 w-full p-8">
      <DashboardOverview />
      <div className="flex gap-3">
        <PurchaseStats />
        <ClubStats />
      </div>
      <ShopStats />
      <SpendingFigures />
      <Announcement />
    </section>
  );
}
