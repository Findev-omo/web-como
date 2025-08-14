import type { Metadata } from "next";
import dynamic from "next/dynamic";
import RQProvider from "@/lib/providers";
import "@/styles/globals.css";
import Script from "next/script";
import AuthInitializer from "@/components/auth/AuthInitializer";

const ToastContainer = dynamic(
  () => import("react-hot-toast").then((c) => c.Toaster),
  {
    ssr: false,
  }
);

export const metadata: Metadata = {
  title: "코모",
  description: "직장인들의 놀이터 omo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen font-suit antialiased bg-gray-50">
        <RQProvider>
          <ToastContainer />
          <AuthInitializer />
          {children}
          <div id="modal-root" />
        </RQProvider>
        <Script
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        />
      </body>
    </html>
  );
}
