import ClubFigures from "@/components/dashboard/company/main/molecules/ClubFigures";
import DownloadFigure from "@/components/dashboard/company/main/molecules/DownloadFigure";
import EmployeeShortcut from "@/components/dashboard/company/main/molecules/EmployeeShortcut";

export default function EmployeeClubFigures() {
  return (
    <div className="flex gap-3">
      <EmployeeShortcut />
      <ClubFigures pendingCount={0} approvedCount={0} />
      {/* <DownloadFigure /> */}
    </div>
  );
}
