"use client";
import RHFTextInput from "@/components/common/RHF/RHFTextInput";
import {
  ScheduleRegisterSchema,
  ScheduleRegisterSchemaType,
} from "@/lib/types/schema";
import { FieldErrors, FormProvider, useForm } from "react-hook-form";
import ScheduleDetailDate from "../molecues/ScheduleDetail/ScheduleDetailDate";
import ScheduleDetailGeo from "../molecues/ScheduleDetail/ScheduleDetailGeo";
import Button from "@/components/common/Button";
import { ScheduleDetailCardInitialData } from "../molecues/ScheduleDetail/ScheduleDetailCard";
import { getAccessToken, getClubId } from "@/lib/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import { format as formatDate } from "date-fns";
import {
  toCreateActivityPayload,
  toUpdateActivityPayload,
} from "@/lib/transformers/activityPayload";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import ScheduleDetailPeriod from "../molecues/ScheduleDetail/ScheduleDetailPeriod";
import toast from "react-hot-toast";

interface ScheduleDetailFormProps {
  type: "REGISTER" | "DETAIL" | "EDIT" | "MEMBERS";
  initialData?: ScheduleDetailCardInitialData;
  scheduleId?: number;
}

const ScheduleDetailForm = ({
  type,
  initialData,
  scheduleId,
}: ScheduleDetailFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("refresh-on-back") === "true") {
      sessionStorage.removeItem("refresh-on-back");
      router.refresh();
    }
  }, [router]);

  const methods = useForm<ScheduleRegisterSchemaType>({
    resolver: zodResolver(ScheduleRegisterSchema),
    defaultValues:
      type !== "REGISTER"
        ? {
            title: initialData?.title,
            description: initialData?.description ?? "",
            location: {
              roadAddress: initialData?.location ?? "",
              placeName: initialData?.addressDetail ?? "",
            },
            date: initialData?.date ? new Date(initialData?.date) : new Date(),
            time: initialData?.time,
            recruitStartDate: initialData?.recruitStartDate,
            recruitEndDate: initialData?.recruitEndDate,
          }
        : {
            title: "",
            description: "",
            location: {
              roadAddress: "",
              placeName: "",
            },
            date: new Date(),
            time: (() => {
              const now = new Date();
              const minutes = now.getMinutes();
              const roundedMinutes = Math.round(minutes / 30) * 30;
              now.setMinutes(roundedMinutes);
              return now.toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });
            })(),
            recruitStartDate: new Date().toISOString(),
            recruitEndDate: new Date(
              new Date().getTime() + 24 * 60 * 60 * 1000
            ).toISOString(),
          },
    mode: type !== "DETAIL" ? "onChange" : "onSubmit",
  });

  useEffect(() => {
    // 디버그: 이 컴포넌트가 어디서 어떤 데이터로 렌더되는지 확인
    // 상세 데이터는 서버 컴포넌트(`app/club/dashboard/manage/schedule/[id]/page.tsx`)에서
    // GET /v1/executive/club/{clubId}/activity/{activityId} 호출 결과를 initialData로 내려줍니다.
    // 아래 로그는 브라우저 콘솔에서 확인 가능합니다.
    // 주의: 페이지 재방문 시 캐시는 no-store로 꺼놓았습니다.
    //       (getData(..., { noCache: true }))
    //       멤버 목록은 schedule/{id}/members 에서 가져옵니다.
    console.log("[ScheduleDetailForm] props", {
      type,
      scheduleId,
      initialData,
    });
    console.log("[ScheduleDetailForm] form defaultValues", methods.getValues());
  }, [type, scheduleId, initialData, methods]);

  const debouncedSubmit = useCallback(
    async (data: ScheduleRegisterSchemaType) => {
      if (isSubmitting) return;

      try {
        setIsSubmitting(true);

        if (type === "REGISTER") {
          try {
            const token = await getAccessToken();
            const clubId = await getClubId();
            const createBody = toCreateActivityPayload(
              data,
              Number.isFinite(Number(clubId)) ? Number(clubId) : 0
            );
            console.log(
              "[ScheduleDetailForm] CREATE -> /v1/executive/club/activity",
              createBody
            );

            const response = await fetch(
              `/api/server/v1/executive/club/activity`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(createBody),
              }
            );

            if (!response.ok) {
              throw new Error("일정 등록에 실패했습니다.");
            }

            toast.success("일정이 등록되었습니다.");
            // 등록 성공 시 뒤로가기 후 새로고침
            await router.back();
            router.refresh();
          } catch (error) {
            console.error("일정 처리 실패:", error);
            toast.error("일정 등록에 실패했습니다.");
          }
        }
        if (type === "EDIT") {
          try {
            const token = await getAccessToken();
            const clubId = await getClubId();

            const patchBody = toUpdateActivityPayload(data);
            console.log(
              `[ScheduleDetailForm] PATCH -> ${process.env.NEXT_PUBLIC_SERVER_URL}/v1/executive/club/${clubId}/activity/${scheduleId}`,
              patchBody
            );

            const response = await fetch(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/v1/executive/club/${clubId}/activity/${scheduleId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(patchBody),
              }
            );

            if (!response.ok) {
              toast.error("일정 수정에 실패했습니다.");
              throw new Error("일정 수정에 실패했습니다.");
            }
            toast.success("일정이 수정되었습니다.");
            // 수정 후 목록 1페이지로 이동
            router.replace(`/club/dashboard/manage/schedule?page=1`);
            router.refresh();
          } catch (error) {
            console.error("일정 수정 실패:", error);
            toast.error("일정 수정에 실패했습니다.");
          }
        }
      } catch (error) {
        console.error("일정 처리 실패:", error);
        toast.error("일정 처리에 실패했습니다.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [type, scheduleId, router, isSubmitting]
  );

  const onSubmit = async (data: ScheduleRegisterSchemaType) => {
    await debouncedSubmit(data);
  };

  const onError = (errors: FieldErrors<ScheduleRegisterSchemaType>) => {
    const errorMessages = Object.entries(errors).map(([field, error]) => {
      return `${field}: ${error.message}`;
    });

    if (type === "REGISTER") {
      console.error("Form validation errors:", errorMessages);
    } else {
      console.error("Form validation errors:", errorMessages);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <section className="w-full flex flex-col gap-6">
          <RHFTextInput<ScheduleRegisterSchemaType>
            name="title"
            id="title"
            labelText="제목"
            autoComplete="off"
            inputStyle="pr-9"
            required
            readOnly={type === "DETAIL"}
            maxLength={30}
          />
          <RHFTextInput<ScheduleRegisterSchemaType>
            name="description"
            id="description"
            labelText="설명"
            autoComplete="off"
            inputStyle="pr-9"
            readOnly={type === "DETAIL"}
            required
            maxLength={300}
            rows={4}
          />
          <ScheduleDetailPeriod type={type} />
          <ScheduleDetailDate type={type} />
          <ScheduleDetailGeo type={type} />
        </section>
        {type !== "DETAIL" && (
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              content="취소"
              onClick={async () => {
                await router.back();
                router.refresh();
              }}
            />
            <Button
              type="submit"
              primary
              content={type === "REGISTER" ? "등록하기" : "수정하기"}
              disabled={isSubmitting}
            />
          </div>
        )}
      </form>
    </FormProvider>
  );
};

export default ScheduleDetailForm;
