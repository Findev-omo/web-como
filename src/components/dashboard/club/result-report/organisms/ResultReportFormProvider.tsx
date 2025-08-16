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
import { ResultReportSchema, ResultReportSchemaType } from "@/lib/types/schema";
import { getAccessToken, getClubId } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import ResultReportAccountsForm from "./ResultReportAccounts";
import ResultReportForm from "./ResultReportForm";
import ResultReportSubmitCard from "./ResultReportSubmitCard";

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

        const submitData = {
          ...data,
          data: {
            ...data.data,
            activityDate: data.data.activityDate
              ? formatDateToString(data.data.activityDate)
              : "",
            receipts: data.data.receipts.map((receipt) => ({
              ...receipt,
              supportAmount: Number(receipt.supportAmount),
              usedAmount: Number(receipt.usedAmount),
              remainingAmount: Number(receipt.remainingAmount),
              amount: Number(receipt.amount),
              issuedDate: receipt.issuedDate
                ? formatDateToString(new Date(receipt.issuedDate))
                : "",
            })),
          },
        };

        const formData = new FormData();
        formData.append(
          "data",
          new Blob([JSON.stringify(submitData.data)], {
            type: "application/json",
          })
        );

        (data.images || []).forEach((file: File) => {
          formData.append("images", file);
        });
        (data.receipts || []).forEach((file: File) => {
          formData.append("receipts", file);
        });

        const token = await getAccessToken();
        const clubId = await getClubId();

        const response = await fetch(
          `/api/server/v1/executive/club/${clubId}/reports`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("활동 보고서 작성에 실패했습니다.");
        }
        await autoSave.clearSavedData();
        toast.success("활동 보고서 작성에 성공했습니다.");

        methods.reset();
        router.back();
      } catch (error) {
        toast.error("활동 보고서 작성에 실패했습니다.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, router, methods, autoSave]
  );

  const onSubmit = async (data: ResultReportSchemaType) => {
    await debouncedSubmit(data);
  };

  const onError = (errors: FieldErrors<ResultReportSchemaType>) => {
    console.log(errors);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
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
