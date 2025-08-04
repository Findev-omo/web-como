"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  src?: string | null;
  size?: string;
}

export default function Avatar({ src, size = "w-8 h-8" }: Props) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={cn("relative rounded-full bg-gray-400", size)}>
      {src && !imageError ? (
        <Image
          src={src}
          alt="프로필"
          className="rounded-full object-cover"
          fill
          sizes="5vw"
          onError={() => {
            console.error("이미지 로드 실패:", src);
            setImageError(true);
          }}
          onLoad={() => {
            console.log("이미지 로드 성공:", src);
          }}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gray-400 flex items-center justify-center">
          <span className="text-white text-xs font-medium">
            {src ? "!" : "?"}
          </span>
        </div>
      )}
    </div>
  );
}
