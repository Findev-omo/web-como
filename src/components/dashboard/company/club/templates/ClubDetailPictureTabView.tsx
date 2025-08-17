import { getData } from "@/api/action";
import { ClubBoards } from "@/api/types/company/club";
import ClubTitle from "@/components/dashboard/shared/molecules/ClubTitle";
import ClubPictureDetailItem from "@/components/dashboard/shared/organisms/ClubPictureDetailItem";
import ClubPictureItem from "@/components/dashboard/shared/organisms/ClubPictureItem";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

export default function ClubDetailPictureTabView() {
  const pathname = usePathname();
  const clubId = pathname.split("/").pop();

  const { data } = useQuery({
    queryKey: [clubId],
    queryFn: () => getData(`v1/manager/club/${clubId}/boards`, false),
  });

  if (!data) return;

  const pictureData = data.data as ClubBoards[];

  return (
    <>
      {/* <ClubTitle /> */}
      {Array.isArray(pictureData) &&
        pictureData?.map((picture: ClubBoards) => (
          <ClubPictureDetailItem key={picture.id} item={picture} readonly />
        ))}
    </>
  );
}
