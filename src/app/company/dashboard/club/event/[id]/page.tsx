import { Calendar } from "@/assets/icons/info";
import Input from "@/components/common/Input";
import BackButton from "@/components/dashboard/common/BackButton";
import Pagination from "@/components/dashboard/common/Pagination";
import Image from "next/image";

const Data = [
  {
    id: 1,
    organizer: "주최자 A",
    name: "행사명 A",
    date: [2025, 5, 11],
    fixed: true, // 유일한 true
  },
  {
    id: 2,
    organizer: "주최자 B",
    name: "행사명 B",
    date: [2025, 5, 12],
    fixed: false,
  },
  {
    id: 3,
    organizer: "주최자 C",
    name: "행사명 C",
    date: [2025, 5, 13],
    fixed: false,
  },
  {
    id: 4,
    organizer: "주최자 D",
    name: "행사명 D",
    date: [2025, 5, 14],
    fixed: false,
  },
  {
    id: 5,
    organizer: "주최자 E",
    name: "행사명 E",
    date: [2025, 5, 15],
    fixed: false,
  },
  {
    id: 6,
    organizer: "주최자 F",
    name: "행사명 F",
    date: [2025, 5, 16],
    fixed: false,
  },
  {
    id: 7,
    organizer: "주최자 G",
    name: "행사명 G",
    date: [2025, 5, 17],
    fixed: false,
  },
  {
    id: 8,
    organizer: "주최자 H",
    name: "행사명 H",
    date: [2025, 5, 18],
    fixed: false,
  },
  {
    id: 9,
    organizer: "주최자 I",
    name: "행사명 I",
    date: [2025, 5, 19],
    fixed: false,
  },
];

export default function Page() {
  return (
    <div className="flex flex-col gap-[12px]">
      <BackButton />
      <div className="flex w-full p-[32px] flex-col  rounded-xl bg-gray-0">
        <span className=" text-2xl font-bold mb-[40px]">동호회 일정</span>
        <div className="flex gap-[16px] mb-[40px]">
          <div className=" relative max-w-[396px] w-full aspect-[1/1] ">
            <Image
              src={"/logo.png"}
              alt="image"
              fill
              className="rounded-[8px]"
            />
          </div>
          <div className="w-full flex flex-col gap-[24px]">
            {/*행사명 */}
            <div className="flex flex-col">
              <span className="font-[600] text-gray-900 text-lg mb-[8px]">
                행사명
              </span>
              <span className=" bg-gray-100 px-[20px] py-[18px]  rounded-[6px] text-lg">
                fdsafsa
              </span>
            </div>

            {/*참여자 모집 기간*/}
            <div className="flex flex-col">
              <span className="font-[600] text-gray-900 text-lg mb-[8px]">
                참여자 모집 기간
              </span>
              <div className="flex gap-[8px]">
                <div className="flex items-center justify-between border-gray-400 w-full border rounded-[6px] px-[20px] py-[18px]">
                  <span>2024.07.01 ~ 07.09</span>
                  <Calendar className="text-gray-500" />
                </div>
                <div className="flex items-center justify-between border-gray-400 w-full border rounded-[6px] px-[20px] py-[18px]">
                  <span>2024.07.01 ~ 07.09</span>
                  <Calendar className="text-gray-500" />
                </div>
              </div>
            </div>

            {/*행사 정보 */}
            <div className="flex flex-col">
              <span className="font-[600] text-gray-900 text-lg mb-[8px]">
                행사 정보
              </span>
              <div className="flex flex-col gap-[24px] bg-gray-100 px-[20px] py-[18px] text-base rounded-[6px]">
                <div className="flex gap-[12px] items-center">
                  <span className=" text-base text-gray-50 rounded-full bg-gray-700 px-[14px] py-[2px] ">
                    활동 일자
                  </span>
                  <span className=" text-lg"> test</span>
                </div>
                <div className="flex gap-[12px] items-center">
                  <span className=" text-base text-gray-50 rounded-full bg-gray-700 px-[14px] py-[2px] ">
                    주소
                  </span>
                  <span className="text-lg">test</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*설명 */}
        <div className="flex flex-col">
          <span className="font-[600] text-gray-900 text-lg mb-[8px]">
            설명
          </span>
          <span className=" bg-gray-100 px-[20px] py-[18px] text-lg rounded-[6px]">
            tests
          </span>
        </div>
      </div>

      <div className="flex w-full p-[32px] flex-col  rounded-xl bg-gray-0">
        <span className=" text-2xl font-bold mb-[40px]">참여 회원</span>
        <div className="flex items-center mt-[16px] border-t border-b border-gray-400 bg-gray-200 py-[13.45px] font-bold ">
          <span className="max-w-[76px] w-full text-center">순번</span>
          <span className="max-w-[120px] w-full text-center ">이름</span>
          <span className="flex-1 px-[24px]">부서</span>
          <span className="max-w-[220px] w-full text-center ">가입일</span>
        </div>
        {Data.map((item) => {
          return (
            <div className="flex items-center border-b border-gray-400 py-[13.45px]   w-full ">
              <span className="max-w-[76px] w-full text-center  ">
                {item.id}{" "}
              </span>
              <span className="max-w-[120px] w-full  text-center  ">
                {item.organizer}{" "}
              </span>
              <span className="flex-1  px-[24px] min-w-0  truncate ">
                {item.name}
              </span>
              <span className="max-w-[220px] w-full text-center">
                {item.date.map((date) => {
                  return <span>{date}</span>;
                })}
              </span>
            </div>
          );
        })}
        <div className="mt-[32px]">
          {/* <Pagination currentPage={1} maxPage={1} handlePageChange={() => {}} /> */}
        </div>
      </div>
    </div>
  );
}
