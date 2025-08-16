import { useEffect, useRef, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { getClubId } from "@/lib/cookies";

interface UseAutoSaveOptions {
  form: UseFormReturn<any>;
  storageKey: string;
  debounceMs?: number;
  enabled?: boolean;
  autoRestore?: boolean;
}

export const useAutoSave = <T extends Record<string, any>>({
  form,
  storageKey,
  debounceMs = 1000,
  enabled = true,
  autoRestore = true,
}: UseAutoSaveOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>("");

  // 세션스토리지 키 생성 (클럽별로 구분)
  const getStorageKey = useCallback(async () => {
    const clubId = await getClubId();
    return `autosave_${clubId}_${storageKey}`;
  }, [storageKey]);

  // 데이터 저장
  const saveData = useCallback(
    async (data: T) => {
      if (!enabled) return;

      try {
        const storageKey = await getStorageKey();

        // Date 객체를 문자열로 변환하는 함수
        const serializeData = (obj: any): any => {
          if (obj === null || obj === undefined) return obj;

          if (obj instanceof Date) {
            return { __type: "Date", value: obj.toISOString() };
          }

          // File 객체는 저장하지 않음
          if (obj instanceof File) {
            return null;
          }

          if (Array.isArray(obj)) {
            return obj.map(serializeData).filter((item) => item !== null);
          }

          if (typeof obj === "object") {
            const serialized: any = {};
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                const serializedValue = serializeData(obj[key]);
                if (serializedValue !== null) {
                  serialized[key] = serializedValue;
                }
              }
            }
            return serialized;
          }

          return obj;
        };

        const serializedData = serializeData(data);
        const dataString = JSON.stringify(serializedData);

        // 마지막 저장된 데이터와 같으면 저장하지 않음
        if (lastSavedRef.current === dataString) return;

        // 세션스토리지에 저장
        sessionStorage.setItem(storageKey, dataString);
        lastSavedRef.current = dataString;

        console.log("Auto-save completed:", storageKey);
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    },
    [enabled, getStorageKey]
  );

  // 데이터 복원
  const restoreData = useCallback(async (): Promise<T | null> => {
    if (!enabled) return null;

    try {
      const storageKey = await getStorageKey();
      const savedData = sessionStorage.getItem(storageKey);

      if (savedData) {
        const parsedData = JSON.parse(savedData);

        // Date 객체를 복원하는 함수
        const deserializeData = (obj: any): any => {
          if (obj === null || obj === undefined) return obj;

          if (obj && typeof obj === "object" && obj.__type === "Date") {
            return new Date(obj.value);
          }

          if (Array.isArray(obj)) {
            return obj.map(deserializeData);
          }

          if (typeof obj === "object") {
            const deserialized: any = {};
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                deserialized[key] = deserializeData(obj[key]);
              }
            }
            return deserialized;
          }

          return obj;
        };

        const deserializedData = deserializeData(parsedData);
        console.log("Auto-save restored:", storageKey);
        return deserializedData;
      }
    } catch (error) {
      console.error("Auto-save restore failed:", error);
    }

    return null;
  }, [enabled, getStorageKey]);

  // 데이터 삭제
  const clearSavedData = useCallback(async () => {
    try {
      const storageKey = await getStorageKey();

      const beforeClear = sessionStorage.getItem(storageKey);

      sessionStorage.removeItem(storageKey);
      lastSavedRef.current = "";
    } catch (error) {
      throw error;
    }
  }, [getStorageKey]);

  // 저장된 데이터가 있는지 확인
  const hasSavedData = useCallback(async (): Promise<boolean> => {
    if (!enabled) return false;

    try {
      const storageKey = await getStorageKey();
      const savedData = sessionStorage.getItem(storageKey);
      return !!savedData;
    } catch (error) {
      console.error("Check saved data failed:", error);
      return false;
    }
  }, [enabled, getStorageKey]);

  // 폼 값 변경 감지 및 자동 저장
  useEffect(() => {
    if (!enabled) return;

    const subscription = form.watch((data) => {
      // 디바운스 처리
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        saveData(data as T);
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [form, saveData, debounceMs, enabled]);

  // 컴포넌트 마운트 시 저장된 데이터 복원 (autoRestore가 true일 때만)
  useEffect(() => {
    if (!enabled || !autoRestore) return;

    const restore = async () => {
      const savedData = await restoreData();
      if (savedData) {
        // 폼에 저장된 데이터 복원
        Object.keys(savedData).forEach((key) => {
          if (savedData[key] !== undefined) {
            form.setValue(key as any, savedData[key], {
              shouldValidate: false,
              shouldDirty: false,
            });
          }
        });

        // 복원된 데이터를 마지막 저장 데이터로 설정
        lastSavedRef.current = JSON.stringify(savedData);

        // 폼 검증 트리거
        setTimeout(() => {
          form.trigger();
        }, 100);
      }
    };

    restore();
  }, [enabled, autoRestore, restoreData, form]);

  return {
    saveData,
    restoreData,
    clearSavedData,
    hasSavedData,
  };
};
