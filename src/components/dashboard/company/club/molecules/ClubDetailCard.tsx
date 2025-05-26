import { People, Calendar } from "@/assets/icons/info";

export default function ClubDetailCard() {
  return (
    <div className="flex w-full p-8  rounded-xl bg-gray-0">
      <div className="flex gap-[12px] items-center">
        <span className="text-2xl font-[600]">동호회명</span>
        <span className="px-[14px] py-[2px] rounded-full bg-brand-black text-brand-ivory text-base ">
          카테고리
        </span>
        <div className="flex gap-[8px] text-base text-gray-500 font-[500]">
          <span>개설일자 2024.05.03</span>
          <div className="gap-[2px] flex items-center">
            <People />
            <span>23</span>
          </div>
          <div className="gap-[2px] flex items-center">
            <Calendar />
            <span>주 1회</span>
          </div>
        </div>
      </div>
    </div>
  );
}
