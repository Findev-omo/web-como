"use server";

import { cookies } from "next/headers";

export const deleteAllCookies = async () => {
  await deleteAccessToken();
  await deleteDashboardType();
  await deleteRole();
  await deleteClubId();
  await deleteClubName();
};

export const saveAccessToken = async (accessToken: string) => {
  cookies().set("accessToken", accessToken);
};

export const getAccessToken = async () => {
  return cookies().get("accessToken")?.value;
};

export const deleteAccessToken = async () => {
  cookies().delete("accessToken");
};

export const saveDashboardType = async (type: string) => {
  cookies().set("type", type);
};

export const getDashboardType = async () => {
  return cookies().get("type")?.value;
};

export const deleteDashboardType = async () => {
  cookies().delete("type");
};

export const saveRole = async (role: string) => {
  cookies().set("role", role);
};

export const getRole = async () => {
  return cookies().get("role")?.value;
};

export const deleteRole = async () => {
  cookies().delete("role");
};

export const saveClubId = async (clubId: string) => {
  cookies().set("clubId", clubId);
};

export const getClubId = async () => {
  return cookies().get("clubId")?.value;
};

export const deleteClubId = async () => {
  cookies().delete("clubId");
};

export const saveClubName = async (clubName: string) => {
  cookies().set("clubName", clubName);
};

export const getClubName = async () => {
  return cookies().get("clubName")?.value;
};

export const deleteClubName = async () => {
  cookies().delete("clubName");
};
