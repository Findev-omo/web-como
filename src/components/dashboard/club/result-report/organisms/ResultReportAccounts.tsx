"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import Card from "@/components/dashboard/common/Card";
import Button from "@/components/common/Button";
import dynamic from "next/dynamic";
import Skeleton from "@/components/common/Skeleton";
import { CustomLabel } from "@/components/common/CustomLabel";
import DropdownSelect from "@/components/common/DropdownSelect";
import RHFTextInput from "@/components/common/RHF/RHFTextInput";
import { ResultReportSchemaType } from "@/lib/types/schema";
import { useRef, useState } from "react";
import { File } from "@/assets/icons/action";

const DatePicker = dynamic(() => import("@/components/common/DatePicker"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[340px]" />,
});

const expenseType = [
  { name: "활정책사업: 인적자원운용", value: "activity" },
  { name: "단위사업: 교직원 복지와 사기진작", value: "welfare" },
  { name: "세부사업: 교직원복지지원", value: "support" },
  { name: "사업 항목: 직장동호회지원", value: "club" },
  { name: "목(240) : 복리후생비", value: "benefit" },
] as const;

const ResultReportAccountsForm = () => {
  const methods = useFormContext<ResultReportSchemaType>();
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "data.receipts",
  });

  // 영수증 파일 업로드 관련
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleReceiptFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFileName(e.target.files[0].name);
    const currentReceipts = methods.watch("receipts") || [];
    methods.setValue("receipts", [...currentReceipts, e.target.files[0]]);
  };

  // 에러 메시지 가져오기
  const getErrorMessage = (fieldPath: string) => {
    const nameParts = fieldPath.split(".");
    let currentErrors: any = methods.formState.errors;

    for (const part of nameParts) {
      if (currentErrors && currentErrors[part]) {
        currentErrors = currentErrors[part];
      } else {
        return undefined;
      }
    }

    return currentErrors?.message?.toString();
  };

  return (
    <section className="flex flex-col gap-3">
      {fields.map((field, idx) => (
        <Card className="mt-3 border p-4 mb-4 rounded w-full" key={field.id}>
          <header className="flex items-center justify-between">
            <h2 className="h1 font-bold text-black">
              활동 지원비 정산서 {fields.length !== 1 && idx + 1}
            </h2>
            {fields.length !== 1 && (
              <button
                type="button"
                onClick={() => remove(idx)}
                disabled={fields.length <= 1}
                className="px-2 py-1 bg-red-500 text-white rounded disabled:opacity-50"
              >
                삭제
              </button>
            )}
          </header>
          <div className="flex gap-3 w-full h-[60px]">
            <div className="w-1/4 flex flex-col gap-2 h-full">
              <CustomLabel
                htmlFor={`data.receipts.${idx}.category`}
                labelText={"과목"}
                required={true}
              />
              <DropdownSelect
                required
                id={`data-receipts-${idx}-category`}
                width="w-[223.5px]"
                height="h-[47px]"
                placeholder="종류 선택"
                options={[...expenseType]}
                currentValue={
                  methods.watch(`data.receipts.${idx}.category`) || ""
                }
                handleChange={(val) =>
                  methods.setValue(`data.receipts.${idx}.category`, val)
                }
              />
            </div>
            <div className="w-1/4 h-full relative">
              <RHFTextInput
                name={`data.receipts.${idx}.supportAmount`}
                id={`data.receipts.${idx}.supportAmount`}
                labelText="지원액"
                placeholder="지원액을 작성해주세요"
                inputStyle="pr-9 flex-1"
                required
                type="number"
              />
              {getErrorMessage(`data.receipts[${idx}].supportAmount`) && (
                <span className="text-red-500 text-sm">
                  {getErrorMessage(`data.receipts[${idx}].supportAmount`)}
                </span>
              )}
            </div>
            <div className="w-1/4 h-full relative">
              <RHFTextInput
                name={`data.receipts.${idx}.usedAmount`}
                id={`data.receipts.${idx}.usedAmount`}
                labelText="사용액"
                placeholder="사용액을 작성해주세요"
                inputStyle="pr-9 flex-1"
                required
                type="number"
              />
            </div>
            <div className="w-1/4 h-full relative">
              <RHFTextInput
                name={`data.receipts.${idx}.remainingAmount`}
                id={`data.receipts.${idx}.remainingAmount`}
                labelText="잔액"
                placeholder="잔액을 작성해주세요"
                inputStyle="pr-9 flex-1"
                required
                type="number"
              />
            </div>
          </div>
          <div className="flex gap-3 w-full h-[60px]">
            <div className="w-1/2 h-full relative">
              <RHFTextInput
                name={`data.receipts.${idx}.usageDetail`}
                id={`data.receipts.${idx}.usageDetail`}
                labelText="사용내역"
                placeholder="사용내역을 작성해주세요"
                inputStyle="pr-9 flex-1"
                required
              />
            </div>
            <div className="w-1/2 h-full relative">
              <RHFTextInput
                name={`data.receipts.${idx}.submittedBy`}
                id={`data.receipts.${idx}.submittedBy`}
                labelText="제출자"
                placeholder="제출자를 작성해주세요"
                inputStyle="pr-9 flex-1"
                required
              />
            </div>
          </div>
          <div className="flex gap-3 w-full h-[60px]">
            <div className="w-1/4 h-full relative">
              <CustomLabel
                htmlFor={`data.receipts.${idx}.issuedDate`}
                labelText={"발행일"}
                required={true}
              />
              <DatePicker
                id={`data-receipts-${idx}-issuedDate`}
                currentDate={
                  methods.watch(`data.receipts.${idx}.issuedDate`)
                    ? new Date(methods.watch(`data.receipts.${idx}.issuedDate`))
                    : undefined
                }
                handleDateChange={(newDate) => {
                  if (newDate) {
                    methods.setValue(
                      `data.receipts.${idx}.issuedDate`,
                      newDate.toISOString().split("T")[0]
                    );
                  }
                }}
              />
            </div>
            <div className="w-1/4 h-full relative">
              <RHFTextInput
                name={`data.receipts.${idx}.vendor`}
                id={`data.receipts.${idx}.vendor`}
                labelText="거래처"
                placeholder="거래처를 작성해주세요"
                inputStyle="pr-9 flex-1"
                required
              />
            </div>
            <div className="w-1/4 h-full relative">
              <RHFTextInput
                name={`data.receipts.${idx}.amount`}
                id={`data.receipts.${idx}.amount`}
                labelText="금액"
                placeholder="금액을 작성해주세요"
                inputStyle="pr-9 flex-1"
                required
                type="number"
              />
            </div>
            <div className="w-1/4 h-full relative">
              <RHFTextInput
                name={`data.receipts.${idx}.description`}
                id={`data.receipts.${idx}.description`}
                labelText="설명"
                placeholder="설명을 작성해주세요"
                inputStyle="pr-9 flex-1"
                required
              />
            </div>
          </div>
        </Card>
      ))}

      {/* 영수증 파일 업로드 */}
      <Card className="mt-3 border p-4 mb-4 rounded w-full">
        <header className="flex items-center justify-between">
          <h2 className="h1 font-bold text-black">영수증 파일</h2>
        </header>
        <div className="relative w-full cursor-pointer flex flex-col gap-2">
          <CustomLabel
            htmlFor="receiptFile"
            labelText="영수증 파일 첨부"
            required={true}
          />
          <div className="relative w-full h-[48px]">
            <input
              type="text"
              value={fileName}
              placeholder="영수증 파일을 첨부해주세요"
              readOnly
              onClick={handleReceiptFileClick}
              className="w-full bg-gray-100 h-full rounded-[6px] px-5 py-6 text-[18px] text-gray-400 font-bold outline-none cursor-pointer"
            />
            <input
              type="file"
              accept="image/*,.pdf"
              ref={fileInputRef}
              className="hidden"
              onChange={handleReceiptFileChange}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <File className="text-gray-400" />
            </div>
          </div>
        </div>
      </Card>

      <Button
        type="button"
        content="정산서 추가"
        onClick={() =>
          append({
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
          })
        }
      />
    </section>
  );
};

export default ResultReportAccountsForm;
