import { getClubId } from "@/lib/cookies";
import AnnouncementSearch from "@/components/dashboard/club/clubAnnouncement/molecules/AnnouncementSearch";
import AnnouncementList from "@/components/dashboard/club/clubAnnouncement/organisms/AnnouncementList";

export default async function ClubAnnouncementPage() {
  const clubId = await getClubId();

  return (
    <>
      <AnnouncementSearch />
      <AnnouncementList clubId={clubId || ""} />
    </>
  );
}
