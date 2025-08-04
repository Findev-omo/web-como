"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OptimizedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  prefetch?: boolean;
  scroll?: boolean;
  shallow?: boolean;
}

export default function OptimizedLink({
  href,
  children,
  className,
  onClick,
  prefetch = true,
  scroll = false,
  shallow = false,
}: OptimizedLinkProps) {
  return (
    <Link
      href={href}
      className={cn("transition-all duration-200", className)}
      onClick={onClick}
      prefetch={prefetch}
      scroll={scroll}
      shallow={shallow}
    >
      {children}
    </Link>
  );
}
