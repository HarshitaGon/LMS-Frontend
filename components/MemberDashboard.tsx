"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MemberStats {
  myTotalLoans: number;
  myActiveLoans: number;
  myReturnedLoans: number;
  myOverdueLoans: number;
  myLoanStatusChart: Array<{ name: string; value: number }>;
}

export function MemberDashboard({
  token,
  userName,
}: {
  token: string;
  userName: string;
}) {
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiRequest(
          "/users/dashboard-stats",
          "GET",
          undefined,
          token,
        );
        setStats(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Failed to load dashboard</p>
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#10b981", "#ef4444"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Loans Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Loans</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.myTotalLoans}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Active Loans</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.myActiveLoans}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Returned Loans</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.myReturnedLoans}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Overdue Loans</p>
            <p
              className={`text-2xl font-bold ${
                stats.myOverdueLoans > 0 ? "text-red-600" : "text-gray-400"
              }`}
            >
              {stats.myOverdueLoans}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Loan Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.myLoanStatusChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.myLoanStatusChart.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Loan Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.myLoanStatusChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
