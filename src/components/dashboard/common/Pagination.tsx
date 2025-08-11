import { cn, getPageRange } from "@/lib/utils";
import {
  ChevronDoubleLeft,
  ChevronDoubleRight,
  ChevronLeft,
  ChevronRight,
} from "@/assets/icons/pagination";

interface Props {
  currentPage: number;
  maxPage: number;
  handlePageChange: (page: number) => void;
}

export default function Pagination(props: Props) {
  const minPage = 1;
  const currentPage =
    Number.isFinite(Number(props.currentPage)) && Number(props.currentPage) > 0
      ? props.currentPage
      : 1;
  const maxPage =
    Number.isFinite(Number(props.maxPage)) && Number(props.maxPage) > 0
      ? props.maxPage
      : 1;

  return (
    <div className="flex gap-4 w-fit mx-auto select-none">
      <div className="flex gap-2.5">
        <button
          className="cursor-pointer"
          onClick={() => props.handlePageChange(minPage)}
          disabled={currentPage === minPage}
        >
          <ChevronDoubleLeft />
        </button>
        <button
          className="cursor-pointer"
          onClick={() => props.handlePageChange(currentPage - 1)}
          disabled={currentPage === minPage}
        >
          <ChevronLeft />
        </button>
      </div>
      <div className="flex gap-2.5 items-center">
        {getPageRange(currentPage).map((page) => (
          <button
            key={page}
            className={cn(
              "w-9 h-9 rounded h4 font-semibold",
              page === currentPage
                ? "border border-brand-orange text-brand-orange"
                : "text-gray-600",
              page > maxPage ? "hidden" : ""
            )}
            onClick={() => props.handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
      <div className="flex gap-2.5 ">
        <button
          className="cursor-pointer"
          onClick={() => props.handlePageChange(currentPage + 1)}
          disabled={currentPage === maxPage}
        >
          <ChevronRight />
        </button>
        <button
          className="cursor-pointer"
          onClick={() => props.handlePageChange(maxPage)}
          disabled={currentPage === maxPage}
        >
          <ChevronDoubleRight />
        </button>
      </div>
    </div>
  );
}
