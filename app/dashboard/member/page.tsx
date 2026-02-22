"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { BookOpen, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

type DashboardStats = {
  myTotalLoans: number;
  myActiveLoans: number;
  myReturnedLoans: number;
  myOverdueLoans: number;
  myLoanStatusChart: {
    name: string;
    value: number;
  }[];
};

export default function MemberDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) throw new Error("User not logged in");

        const { token } = JSON.parse(storedUser);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/user`,
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
      <div className="flex items-center justify-center h-[60vh] text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 space-y-8 bg-linear-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Member Dashboard</h1>
        <p className="text-gray-500">Track your books, returns & overdue</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Loans"
          value={stats.myTotalLoans}
          icon={<BookOpen className="text-indigo-600" />}
          bg="bg-indigo-50"
        />
        <StatCard
          title="Active Loans"
          value={stats.myActiveLoans}
          icon={<Clock className="text-blue-600" />}
          bg="bg-blue-50"
        />
        <StatCard
          title="Returned"
          value={stats.myReturnedLoans}
          icon={<CheckCircle className="text-green-600" />}
          bg="bg-green-50"
        />
        <StatCard
          title="Overdue"
          value={stats.myOverdueLoans}
          icon={<AlertTriangle className="text-red-600" />}
          bg="bg-red-50"
        />
      </div>

      {/* CHART */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Loan Status Breakdown</h2>

        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.myLoanStatusChart}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div
      className={`rounded-2xl p-5 shadow-sm hover:shadow-md transition ${bg}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="p-3 bg-white rounded-xl shadow">{icon}</div>
      </div>
    </div>
  );
}
