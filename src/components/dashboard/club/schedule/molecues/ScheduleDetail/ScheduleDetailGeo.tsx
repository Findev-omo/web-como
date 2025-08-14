import { CustomLabel } from "@/components/common/CustomLabel";
import MapPlaceSearch from "../../../manage/organisms/MapPlaceSearch";
import RHFTextInput from "@/components/common/RHF/RHFTextInput";
import { ScheduleRegisterSchemaType } from "@/lib/types/schema";
import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const ScheduleDetailGeo = ({
  type,
  maxWidth,
}: {
  type: string;
  maxWidth?: string;
}) => {
  const { setValue, watch } = useFormContext<ScheduleRegisterSchemaType>();

  const location = watch("location");

  const roadAddressForSearch = useMemo(() => {
    const base = (location?.roadAddress ?? "").toString();
    const detail = (location?.placeName ?? "").toString();
    if (!base) return "";
    const normalizedBase = base.replace(/\s+/g, " ").trim();
    const normalizedDetail = detail.replace(/\s+/g, " ").trim();
    if (!normalizedDetail) return normalizedBase;
    if (normalizedBase.endsWith(normalizedDetail)) {
      return normalizedBase
        .slice(0, normalizedBase.length - normalizedDetail.length)
        .trim();
    }
    const idx = normalizedBase.indexOf(normalizedDetail);
    if (idx > -1) {
      return (
        normalizedBase.slice(0, idx) +
        normalizedBase.slice(idx + normalizedDetail.length)
      ).trim();
    }
    return normalizedBase;
  }, [location?.roadAddress, location?.placeName]);

  return (
    <div className={cn("flex flex-col gap-2", maxWidth)}>
      <CustomLabel
        htmlFor="location"
        labelText="활동 장소 설정"
        required={true}
        className=""
      />
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <MapPlaceSearch
            maxWidth="w-full"
            isLabel={false}
            value={roadAddressForSearch}
            handleChange={(newLocation) => {
              setValue("location.roadAddress", newLocation.roadAddress);
              setValue("location.latitude", newLocation.latitude);
              setValue("location.longitude", newLocation.longitude);
            }}
            readonly={type === "DETAIL"}
          />
        </div>
        <div className="flex-1">
          <div className="mb-2">
            <CustomLabel
              htmlFor="location.placeName"
              labelText="상세 주소"
              required={true}
            />
          </div>
          <RHFTextInput<ScheduleRegisterSchemaType>
            name="location.placeName"
            id="location.placeName"
            placeholder="상세 주소를 입력하세요."
            inputStyle="w-full pr-9 h-[60px]"
            readOnly={type === "DETAIL"}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailGeo;
