import { getData } from "@/api/action";
import ClubOverview from "@/components/dashboard/company/club/molecules/ClubOverview";
import ClubView from "@/components/dashboard/company/club/templates/ClubView";
import ApplicantProfileModal from "@/components/dashboard/company/club/modals/ApplicantProfileModal";
import DisbandInfoModal from "@/components/dashboard/company/club/modals/DisbandInfoModal";

export default async function Page() {
  const [active] = await Promise.all([
    getData("v1/manager/club/approved-count", true),
  ]);

  const stats = {
    dissolutionPending: 0,
    active: active.data || 0,
    dissolved: 0,
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
