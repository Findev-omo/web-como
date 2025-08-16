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
  console.log(data);
  console.log("data.data", data.data);

  const pictureData = data.data as ClubBoards[];

  console.log("pictureData", pictureData);
  console.log("pictureData 타입:", typeof pictureData);
  console.log("pictureData가 배열인가?", Array.isArray(pictureData));
  console.log(
    "pictureData 길이:",
    Array.isArray(pictureData) ? pictureData.length : "배열이 아님"
  );
  console.log("pictureData 내용:", JSON.stringify(pictureData, null, 2));

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
