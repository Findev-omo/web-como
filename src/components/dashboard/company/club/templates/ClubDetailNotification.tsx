import NotificationDetailComponent from "@/components/common/NotificationDetailComponent";
import ClubDetailCard from "@/components/dashboard/company/club/molecules/ClubDetailCard";
import ClubDetailNotificationList from "@/components/dashboard/company/club/molecules/ClubDetailNotificationList";

export default function ClubDetailNotification() {
  return (
    <>
      <ClubDetailCard />
      <ClubDetailNotificationList />
    </>
  );
}
