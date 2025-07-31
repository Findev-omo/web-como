"use client";

import { cn, closeModal } from "@/lib/utils";
import { type MouseEventHandler } from "react";

interface Props {
  invisible?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  modalId?: string;
}

export default function Backdrop({
  invisible = false,
  onClick,
  modalId,
}: Props) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-10",
        invisible ? "bg-none" : "bg-gray-900/60"
      )}
      onClick={modalId ? () => closeModal(modalId) : onClick}
    />
  );
}
