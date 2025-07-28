import { getData } from "@/api/action";
import ApplicationOverview from "@/components/dashboard/company/club/molecules/ApplicationOverview";
import ApplicationView from "@/components/dashboard/company/club/templates/ApplicationView";
import ApplicantProfileModal from "@/components/dashboard/company/club/modals/ApplicantProfileModal";
import RejectApplicationModal from "@/components/dashboard/company/club/modals/RejectApplicationModal";
import RevertRejectionModal from "@/components/dashboard/company/club/modals/RevertRejectionModal";

export default async function NewApplicationPage() {
  const [pending, approved, rejected] = await Promise.all([
    getData("v1/manager/club/pending-count", true),
    getData("v1/manager/club/approved-count", true),
    getData("v1/manager/club/rejected-count", true),
  ]);

  const stats = {
    pending: pending.data || 0,
    approved: approved.data || 0,
    rejected: rejected.data || 0,
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
