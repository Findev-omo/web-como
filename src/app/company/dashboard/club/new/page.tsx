import { getData } from "@/api/action";
import ApplicationOverview from "@/components/dashboard/company/club/molecules/ApplicationOverview";
import ApplicationView from "@/components/dashboard/company/club/templates/ApplicationView";
import ApplicantProfileModal from "@/components/dashboard/company/club/modals/ApplicantProfileModal";
import RejectApplicationModal from "@/components/dashboard/company/club/modals/RejectApplicationModal";
import RevertRejectionModal from "@/components/dashboard/company/club/modals/RevertRejectionModal";
import type { ClubStatusCountResponse } from "@/api/types/company/club";

export default async function NewApplicationPage() {
  const statusResponse = (await getData(
    "v1/manager/club/status-count",
    true
  )) as unknown as ClubStatusCountResponse;

  const stats = {
    pending: statusResponse.data?.pendingCount || 0,
    approved: statusResponse.data?.approvedCount || 0,
    rejected: statusResponse.data?.rejectedCount || 0,
  };

  return (
    <>
      <ApplicationOverview stats={stats} />
      <ApplicationView />
      <div className="mt-0">
        <ApplicantProfileModal />
        <RejectApplicationModal />
        <RevertRejectionModal />
      </div>
    </>
  );
}
