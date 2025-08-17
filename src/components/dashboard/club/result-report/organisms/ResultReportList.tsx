"use client";

import { useEffect, useState } from "react";
import {
  getClubReportList,
  ClubReportListParams,
} from "@/api/actions/club/report";
import { ClubReportResponse } from "@/lib/types/schema";
import Card from "@/components/dashboard/common/Card";
import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ResultReportList = () => {
  const [reports, setReports] = useState<ClubReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  // 현재 날짜 기준으로 1개월 전후 데이터 조회
  const getDateRange = () => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

  const fetchReports = async (page: number = 0) => {
    try {
      setLoading(true);
      const dateRange = getDateRange();
      const params: ClubReportListParams = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        page: page.toString(),
      };

      const data = await getClubReportList(params);
      setReports(data);
    } catch (error) {
      console.error("보고서 목록 조회 실패:", error);
      toast.error("보고서 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleNewReport = () => {
    router.push("/club/dashboard/result-report");
  };

  const handleViewReport = (reportId: number) => {
    router.push(`/club/dashboard/result-report/${reportId}`);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "대기중";
      case "APPROVED":
        return "승인됨";
      case "REJECTED":
        return "거부됨";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "APPROVED":
        return "text-green-600 bg-green-100";
      case "REJECTED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">활동 보고서 목록</h1>
        <Button content="새 보고서 작성" primary onClick={handleNewReport} />
      </div>

      {reports.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500 mb-4">
            작성된 활동 보고서가 없습니다.
          </div>
          <Button
            content="첫 번째 보고서 작성하기"
            primary
            onClick={handleNewReport}
          />
        </Card>
      ) : (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {report.eventName}
                  </h3>
                  <div className="text-sm text-gray-600 mb-2">
                    활동일: {report.activityDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {getStatusText(report.status)}
                    </span>
                  </div>
                </div>
                <Button
                  content="상세보기"
                  onClick={() => handleViewReport(report.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {reports.length > 0 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            content="이전"
            disabled={currentPage === 0}
            onClick={() => {
              const newPage = currentPage - 1;
              setCurrentPage(newPage);
              fetchReports(newPage);
            }}
          />
          <span className="flex items-center px-4">
            {currentPage + 1} 페이지
          </span>
          <Button
            content="다음"
            disabled={reports.length < 10} // 페이지당 10개라고 가정
            onClick={() => {
              const newPage = currentPage + 1;
              setCurrentPage(newPage);
              fetchReports(newPage);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ResultReportList;
