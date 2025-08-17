import { getData } from "@/api/action";
import ClubOverview from "@/components/dashboard/company/club/molecules/ClubOverview";
import ClubView from "@/components/dashboard/company/club/templates/ClubView";
import ApplicantProfileModal from "@/components/dashboard/company/club/modals/ApplicantProfileModal";
import DisbandInfoModal from "@/components/dashboard/company/club/modals/DisbandInfoModal";

export default async function Page() {
  const statusCounts = await getData("v1/manager/club/status-counts", true);

  const stats = {
    dissolutionPending: 0,
    active: statusCounts.data?.approvedCount || 0,
    dissolved: statusCounts.data?.rejectedCount || 0,
  };

  return (
    <>
      <ClubOverview stats={stats} />
      <ClubView />
      <div className="mt-0">
        <ApplicantProfileModal />
        <DisbandInfoModal />
      </div>
    </>
  );
}
