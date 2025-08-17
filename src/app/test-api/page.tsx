"use client";

import { useState } from "react";

export default function TestApiPage() {
  const [memberId, setMemberId] = useState("1");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8090/api";
      const response = await fetch(
        `${baseUrl}/v1/manager/member/${memberId}/modal`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API 엔드포인트 테스트</h1>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Member ID:</label>
          <input
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            placeholder="테스트할 member ID를 입력하세요"
          />
        </div>

        <button
          onClick={testApi}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "테스트 중..." : "API 테스트"}
        </button>
      </div>

      {result && (
        <div className="border border-gray-300 rounded p-4">
          <h2 className="text-lg font-semibold mb-2">테스트 결과:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold mb-2">사용법:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>위의 Member ID 입력란에 테스트할 member ID를 입력하세요</li>
          <li>"API 테스트" 버튼을 클릭하세요</li>
          <li>결과를 확인하세요</li>
          <li>실제 애플리케이션에서는 인증 토큰이 필요할 수 있습니다</li>
        </ol>
      </div>
    </div>
  );
}
