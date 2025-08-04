"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  saveAccessToken,
  saveDashboardType,
  saveRefreshToken,
  saveRole,
} from "@/lib/cookies";
import { LOGIN_ENDPOINT, COMPANY_DASHBOARD_ENDPOINT } from "@/lib/constants";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import RadioSelect from "@/components/login/molecules/RadioSelect";
import BrandImage from "@/assets/images/brand_image.svg";
import LogoImage from "@/assets/logos/como_logo.svg";
import { SHA256 } from "crypto-js";
import { enc } from "crypto-js";

interface UserLoginDto {
  id: string;
  password: string;
  role: string;
}

export default function LoginForm() {
  const { replace, refresh } = useRouter();
  const [formData, setFormData] = useState<UserLoginDto>({
    id: "",
    password: "",
    role: "club", // 기본값은 동호회 임원
  });
  const [isLoading, setIsLoading] = useState(false);

  // 입력값 에러 상태 추가
  const [errors, setErrors] = useState({
    id: "",
    password: "",
  });
  // 로그인 에러 메시지를 위한 상태 추가
  const [loginError, setLoginError] = useState("");

  // RadioSelect에서 role 변경 시 호출되는 handleChange
  const handleRoleChange = (newValue: string) => {
    // role 타입 체크
    if (newValue === "club" || newValue === "company") {
      setFormData((prev) => ({ ...prev, role: newValue }));
      // console.log('선택된 role:', newValue);
    }
  };

  // 입력값 유효성 검사 함수
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      id: "",
      password: "",
    };

    // 아이디 체크를 먼저 수행
    if (!formData.id.trim()) {
      newErrors.id = "필수 입력사항입니다.";
      isValid = false;
      setErrors(newErrors);
      return isValid; // 아이디가 비어있으면 바로 리턴
    }

    // 아이디가 있을 때만 비밀번호 체크
    if (!formData.password.trim()) {
      newErrors.password = "필수 입력사항입니다.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("1. 로그인 시도:", {
    //   이메일: formData.id,
    //   역할: formData.role,
    // });

    setLoginError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // 비밀번호 해싱
      const hashedPassword = SHA256(formData.password).toString(enc.Hex);
      // console.log("2. 비밀번호 해싱 완료");

      const response = await fetch(`/api/server/login`, {
        method: "POST",
        body: JSON.stringify({
          email: formData.id,
          password: hashedPassword, // 해싱된 비밀번호 전송
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // console.log("3. API 응답 상태:", response.status);
      // console.log("4. API 응답 헤더:", Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      // console.log("5. API 응답 데이터:", responseText);

      if (!response.ok) {
        // console.log("6. 로그인 실패");
        setLoginError("올바른 정보가 아닙니다.");
        return;
      }

      const accessTokenHeader = response.headers.get("Authorization");
      const refreshToken = response.headers.get("authorization-refresh"); // 실제 헤더 이름으로 수정
      // console.log("7. 받은 토큰:", accessToken, refreshToken);

      if (!accessTokenHeader || !refreshToken) {
        // 두 토큰 모두 확인
        // console.log("8. 토큰 없음");
        setLoginError("로그인에 실패했습니다. 다시 시도해주세요."); // 사용자에게 피드백
        return;
      }

      // "Bearer " 접두사 제거
      const accessToken = accessTokenHeader.replace("Bearer ", "");

      // console.log("9. 토큰 저장 시작");
      await saveAccessToken(accessToken);
      await saveRefreshToken(refreshToken); // 올바른 refreshToken 저장
      await saveDashboardType(formData.role);
      await saveRole(formData.role);
      // console.log("10. 저장 완료, role:", formData.role);

      if (formData.role === "club") {
        replace(`${LOGIN_ENDPOINT}/club`);
      } else if (formData.role === "company") {
        replace(COMPANY_DASHBOARD_ENDPOINT);
      }
    } catch (error) {
      console.error("에러 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 md:w-[1200px] md:p-8 rounded-4xl md:shadow md:bg-gray-0">
      <div className="relative w-[350px] md:w-[530px] h-[350px] md:h-[530px]">
        <Image src={BrandImage} alt="OMO" fill priority />
      </div>
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-between gap-4 md:w-[530px] md:h-[530px] py-6"
      >
        <Image
          src={LogoImage}
          alt="C'OMO for business"
          width={186}
          className="hidden md:block self-center"
        />
        <h2 className="hidden md:block h1 text-center font-bold text-gray-1000">
          {"로그인"}
        </h2>
        <div className="space-y-4">
          <div>
            <Input
              name="id"
              type="text"
              placeholder="아이디"
              currentValue={formData.id}
              handleInputChange={(e) =>
                setFormData((prev) => {
                  return { ...prev, id: e.target.value };
                })
              }
            />
            {errors.id && (
              <p
                className="mt-2 text-[16px] font-[500]"
                style={{ color: "#FF3D00" }}
              >
                {errors.id}
              </p>
            )}
          </div>
          <div>
            <Input
              name="password"
              type="password"
              placeholder="비밀번호"
              currentValue={formData.password}
              handleInputChange={(e) =>
                setFormData((prev) => {
                  return { ...prev, password: e.target.value };
                })
              }
            />
            {errors.password && (
              <p
                className="mt-2 text-[16px] font-[500]"
                style={{ color: "#FF3D00" }}
              >
                {errors.password}
              </p>
            )}
            {/* 로그인 에러 메시지를 비밀번호 필드 아래에 표시 */}
            {loginError && (
              <p
                className="mt-2 text-[16px] font-[500]"
                style={{ color: "#FF3D00" }}
              >
                {loginError}
              </p>
            )}
          </div>
          <RadioSelect
            currentValue={formData.role}
            handleChange={handleRoleChange}
          />
        </div>
        <Button
          content={isLoading ? "로그인 중..." : "로그인"}
          primary
          disabled={isLoading}
        />
        <div className="self-center flex items-center gap-4">
          <span className="body-1 font-normal text-gray-500">
            {"비밀번호가 기억이 나지 않나요?"}
          </span>
          <span className="h-[15px] border-l border-gray-300" />
          <Link href={"/login/identify"}>
            <span className="body-1 font-semibold text-gray-900">
              {"비밀번호 재설정"}
            </span>
          </Link>
        </div>
      </form>
    </div>
  );
}
