"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AdminStats {
  totalLoans: number;
  activeLoans: number;
  returnedLoans: number;
  overdueLoans: number;
  totalUsers: number;
  loanStatusChart: Array<{ name: string; value: number }>;
  loansOverTime: Array<{ date: string; count: number }>;
}

export default function AdminDashboard({ token }: { token: string }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) throw new Error("User not logged in");

        const { token } = JSON.parse(storedUser);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/admin`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Failed to fetch dashboard stats");

        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Loans</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalLoans}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Active Loans</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.activeLoans}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Returned Loans</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.returnedLoans}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Overdue Loans</p>
            <p
              className={`text-2xl font-bold ${
                stats.overdueLoans > 0 ? "text-red-600" : "text-gray-400"
              }`}
            >
              {stats.overdueLoans}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-orange-600">
              {stats.totalUsers}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Loan Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.loanStatusChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.loanStatusChart.map((_, index) => (
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
            <h2 className="text-lg font-semibold mb-4">Loans Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.loansOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
