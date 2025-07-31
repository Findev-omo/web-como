"use client";

import { cn } from "@/lib/utils";
import { type MouseEventHandler } from "react";

interface Props {
  invisible?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function Backdrop({ invisible = false, onClick }: Props) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-10",
        invisible ? "bg-none" : "bg-gray-900/60"
      )}
      onClick={onClick}
    />
  );
}
