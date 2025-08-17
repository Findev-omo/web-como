"use client";

import {
  useForm,
  FormProvider,
  type SubmitHandler,
  type FieldValues,
  type FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAutoSave } from "@/hooks/useAutoSave";
import { AutoSaveRestoreAlert } from "../molecules/AutoSaveRestoreAlert";
import {
  ResultReportSchema,
  ResultReportSchemaType,
  ClubReportCreateRequest,
} from "@/lib/types/schema";
import { getAccessToken, getClubId } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import ResultReportAccountsForm from "./ResultReportAccounts";
import ResultReportForm from "./ResultReportForm";
import ResultReportSubmitCard from "./ResultReportSubmitCard";
import { createClubReport } from "@/api/actions/club/report";

function formatDateToString(date: Date | string) {
  if (typeof date === "string") return date;

  return date.toLocaleDateString("en-CA");
}

const ResultReportFormProvider = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSavedData, setHasSavedData] = useState(false);

  const methods = useForm<ResultReportSchemaType>({
    resolver: zodResolver(ResultReportSchema),
    mode: "all",
    defaultValues: {
      data: {
        eventName: "",
        activityDate: new Date(),
        activityTime: "00:00",
        location: "",
        locationDetail: "",
        participantCount: 0,
        activityContent: "",
        note: "",
        receipts: [
          {
            category: "",
            supportAmount: "",
            usedAmount: "",
            remainingAmount: "",
            usageDetail: "",
            submittedBy: "",
            issuedDate: "",
            vendor: "",
            amount: "",
            description: "",
          },
        ],
      },
      images: [],
      receipts: [],
    },
  });

  useEffect(() => {
    methods.trigger();
  }, [methods]);

  const autoSave = useAutoSave({
    form: methods,
    storageKey: "result-report-form",
    debounceMs: 2000,
    enabled: true,
    autoRestore: false,
  });

  // 컴포넌트 마운트 시 저장된 데이터가 있는지 확인
  useEffect(() => {
    const checkSavedData = async () => {
      const hasData = await autoSave.hasSavedData();
      setHasSavedData(hasData);
    };

    checkSavedData();
  }, [autoSave]);

  const debouncedSubmit = useCallback(
    async (data: ResultReportSchemaType) => {
      if (isSubmitting) return;
      methods.trigger();

      try {
        setIsSubmitting(true);

        // 폼 데이터를 API DTO로 변환
        const reportData: ClubReportCreateRequest = {
          eventName: data.data.eventName,
          activityDate: data.data.activityDate
            ? formatDateToString(data.data.activityDate)
            : "",
          activityTime: data.data.activityTime,
          location: data.data.location,
          locationDetail: data.data.locationDetail,
          participantCount: data.data.participantCount,
          activityContent: data.data.activityContent,
          note: data.data.note || "",
          receipts: data.data.receipts.map((receipt) => ({
            category: receipt.category,
            supportAmount: Number(receipt.supportAmount),
            usedAmount: Number(receipt.usedAmount),
            remainingAmount: Number(receipt.remainingAmount),
            usageDetail: receipt.usageDetail,
            submittedBy: receipt.submittedBy,
            issuedDate: receipt.issuedDate
              ? formatDateToString(new Date(receipt.issuedDate))
              : "",
            vendor: receipt.vendor,
            amount: Number(receipt.amount),
            description: receipt.description,
          })),
        };

        // 디버깅을 위한 로그
        console.log("Submit Data:", reportData);
        console.log("Images count:", data.images?.length || 0);
        console.log("Receipts count:", data.receipts?.length || 0);

        // API 호출
        await createClubReport(
          reportData,
          data.images || [],
          data.receipts || []
        );

        await autoSave.clearSavedData();
        toast.success("활동 보고서 작성에 성공했습니다.");

        methods.reset();
        router.push("/club/dashboard/result-report/list");
      } catch (error) {
        console.error("Submit error:", error);
        toast.error("활동 보고서 작성에 실패했습니다.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, router, methods, autoSave]
  );

  const onSubmit = async (data: ResultReportSchemaType) => {
    // 기본 폼 제출을 방지하고 클라이언트 사이드에서 처리
    await debouncedSubmit(data);
  };

  const onError = (errors: FieldErrors<ResultReportSchemaType>) => {
    console.log(errors);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 기본 폼 제출 방지
    const isValid = await methods.trigger();
    if (isValid) {
      const formData = methods.getValues();
      await debouncedSubmit(formData);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit}>
        <article className="flex-1 flex flex-col gap-3">
          <ResultReportForm />
          <ResultReportAccountsForm />
          <ResultReportSubmitCard isSubmitting={isSubmitting} />
        </article>
      </form>
      <AutoSaveRestoreAlert
        handleRestore={async () => {
          const savedData = await autoSave.restoreData();
          if (savedData) {
            Object.keys(savedData).forEach((key) => {
              if (savedData[key] !== undefined) {
                // images와 receipts는 File 객체이므로 복원하지 않고 빈 배열로 설정
                if (key === "images" || key === "receipts") {
                  methods.setValue(key as any, []);
                } else {
                  methods.setValue(key as any, savedData[key]);
                }
              }
            });
            // 폼 검증 트리거 (지연을 두어 DOM 업데이트 후 실행)
            setTimeout(() => {
              methods.trigger();
            }, 100);
          }
        }}
        clearSavedData={autoSave.clearSavedData}
        hasSavedData={hasSavedData}
      />
    </FormProvider>
  );
};

export default ResultReportFormProvider;
