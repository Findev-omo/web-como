import { CustomLabel } from "@/components/common/CustomLabel";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/Skeleton";
import { ScheduleRegisterSchemaType } from "@/lib/types/schema";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";

const DatePicker = dynamic(() => import("@/components/common/DatePicker"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[340px]" />,
});

const ScheduleDetailPeriod = ({ type }: { type: string }) => {
  const { setValue, watch } = useFormContext<ScheduleRegisterSchemaType>();

  const recruitStartDateRaw = watch("recruitStartDate");
  const recruitEndDateRaw = watch("recruitEndDate");

  // recruitStartDate가 없으면 오늘 날짜로 설정
  const startDate = useMemo(() => {
    const date = recruitStartDateRaw
      ? new Date(recruitStartDateRaw)
      : new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, [recruitStartDateRaw]);
  const endDate = useMemo(() => {
    if (recruitEndDateRaw) {
      const date = new Date(recruitEndDateRaw);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    // recruitEndDate가 없으면 startDate 기준으로 하루 후 설정
    const defaultEndDate = new Date(startDate);
    defaultEndDate.setDate(defaultEndDate.getDate() + 1);
    defaultEndDate.setHours(0, 0, 0, 0);
    return defaultEndDate;
  }, [recruitEndDateRaw, startDate]);

  useEffect(() => {
    if (type !== "DETAIL") {
      const currentStart = recruitStartDateRaw
        ? new Date(recruitStartDateRaw)
        : null;
      const needUpdateStart =
        !currentStart || currentStart.getTime() !== startDate.getTime();
      if (needUpdateStart) {
        setValue("recruitStartDate", startDate.toISOString(), {
          shouldDirty: true,
          shouldValidate: false,
        });
      }

      const currentEnd = recruitEndDateRaw ? new Date(recruitEndDateRaw) : null;
      const shouldClampEnd =
        currentStart && currentEnd && currentStart > currentEnd;
      if (shouldClampEnd) {
        setValue("recruitEndDate", startDate.toISOString(), {
          shouldDirty: true,
          shouldValidate: false,
        });
      }
    }
  }, [startDate, recruitStartDateRaw, recruitEndDateRaw, setValue, type]);

  return (
    <div className="flex flex-col gap-2">
      <CustomLabel
        htmlFor="date"
        labelText={"참여자 모집 기간 설정"}
        required={true}
      />
      <div className="flex items-center gap-3">
        <DatePicker
          id="recruit-start-date"
          size="h-[60px]"
          textStyle="h4 font-medium text-gray-900"
          currentDate={startDate}
          handleDateChange={(newDate) => {
            if (newDate) {
              newDate.setHours(0, 0, 0, 0);
              setValue("recruitStartDate", newDate.toISOString());
            }
          }}
          disabled={type === "DETAIL"}
          disablePastDates={true}
        />
        <DatePicker
          id="recruit-end-date"
          size="h-[60px]"
          disabledDatesMatcher={(date) => {
            return date < new Date(recruitStartDateRaw);
          }}
          textStyle="h4 font-medium text-gray-900"
          currentDate={endDate}
          handleDateChange={(newDate) => {
            if (newDate) {
              newDate.setHours(0, 0, 0, 0);
              setValue("recruitEndDate", newDate.toISOString());
            }
          }}
          disabled={type === "DETAIL"}
          disablePastDates={true}
        />
      </div>
    </div>
  );
};

export default ScheduleDetailPeriod;
