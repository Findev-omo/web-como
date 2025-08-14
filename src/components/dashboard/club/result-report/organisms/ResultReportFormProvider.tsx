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
        expenses: [
          {
            category: "",
            supportAmount: "",
            usedAmount: "",
            remainingAmount: "",
            usageDetail: "",
            submittedBy: "",
            issuedDate: new Date(),
            vendor: "",
            amount: "",
            description: "",
          },
        ],
      },
      photos: [],
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

  const debouncedSubmit = useCallback(
    async (data: ResultReportSchemaType) => {
      if (isSubmitting) return;
      methods.trigger();

      try {
        setIsSubmitting(true);

        const receiptsForApi = data.data.expenses.map((expense) => ({
          ...expense,
          supportAmount: Number(expense.supportAmount),
          usedAmount: Number(expense.usedAmount),
          remainingAmount: Number(expense.remainingAmount),
          amount: Number(expense.amount),
          issuedDate: expense.issuedDate
            ? formatDateToString(expense.issuedDate)
            : "",
        }));

        const dataForApi = {
          eventName: data.data.eventName,
          activityDate: data.data.activityDate
            ? formatDateToString(data.data.activityDate)
            : "",
          activityTime: data.data.activityTime,
          location: data.data.location,
          locationDetail: data.data.locationDetail,
          participantCount: data.data.participantCount,
          activityContent: data.data.activityContent,
          note: data.data.note,
          receipts: receiptsForApi,
        };

        const formData = new FormData();
        formData.append(
          "data",
          new Blob([JSON.stringify(dataForApi)], { type: "application/json" })
        );

        // OpenAPI 명세에 맞춰 필드명을 images로 전송
        (data.photos || []).forEach((file: File) => {
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
                methods.setValue(key as any, savedData[key]);
              }
            });
          }
        }}
        clearSavedData={autoSave.clearSavedData}
      />
    </FormProvider>
  );
};

export default ResultReportFormProvider;
