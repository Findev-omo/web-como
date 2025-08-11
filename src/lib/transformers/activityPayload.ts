import { format as formatDate } from "date-fns";
import { ScheduleRegisterSchemaType } from "@/lib/types/schema";

type CreatePayload = {
  clubId: number;
  title: string;
  detail: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string; // roadAddress or address fallback
  addressDetail: string; // placeName
  latitude: string;
  longitude: string;
};

type UpdatePayload = Omit<CreatePayload, "clubId">;

export const toCreateActivityPayload = (
  form: ScheduleRegisterSchemaType,
  clubId: number
): CreatePayload => {
  return {
    clubId,
    title: form.title,
    detail: form.description,
    date: formatDate(new Date(form.date), "yyyy-MM-dd"),
    time: form.time,
    location:
      form.location?.roadAddress || (form as any)?.location?.address || "",
    addressDetail: form.location?.placeName || "",
    latitude: String(form.location?.latitude ?? ""),
    longitude: String(form.location?.longitude ?? ""),
  };
};

export const toUpdateActivityPayload = (
  form: ScheduleRegisterSchemaType
): UpdatePayload => {
  return {
    title: form.title,
    detail: form.description,
    date: formatDate(new Date(form.date), "yyyy-MM-dd"),
    time: form.time,
    location:
      form.location?.roadAddress || (form as any)?.location?.address || "",
    addressDetail: form.location?.placeName || "",
    latitude: String(form.location?.latitude ?? ""),
    longitude: String(form.location?.longitude ?? ""),
  };
};
