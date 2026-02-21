// "use client";

// import { useEffect, useState } from "react";
// import { apiRequest } from "@/lib/api";
// import { Card } from "@/components/ui/card";
// import { toast } from "sonner";
// import {
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// interface MemberStats {
//   myTotalLoans: number;
//   myActiveLoans: number;
//   myReturnedLoans: number;
//   myOverdueLoans: number;
//   myLoanStatusChart: Array<{ name: string; value: number }>;
// }

// export function MemberDashboard({
//   token,
//   userName,
// }: {
//   token: string;
//   userName: string;
// }) {
//   const [stats, setStats] = useState<MemberStats | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const data = await apiRequest(
//           "/users/dashboard-stats",
//           "GET",
//           undefined,
//           token,
//         );
//         setStats(data);
//       } catch (error) {
//         toast.error(
//           error instanceof Error ? error.message : "Failed to load dashboard",
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, [token]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-gray-600">Loading dashboard...</p>
//       </div>
//     );
//   }

//   if (!stats) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-gray-600">Failed to load dashboard</p>
//       </div>
//     );
//   }

//   const COLORS = ["#3b82f6", "#10b981", "#ef4444"];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold mb-8">My Loans Dashboard</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           <Card className="p-4">
//             <p className="text-sm text-gray-600">Total Loans</p>
//             <p className="text-2xl font-bold text-blue-600">
//               {stats.myTotalLoans}
//             </p>
//           </Card>
//           <Card className="p-4">
//             <p className="text-sm text-gray-600">Active Loans</p>
//             <p className="text-2xl font-bold text-green-600">
//               {stats.myActiveLoans}
//             </p>
//           </Card>
//           <Card className="p-4">
//             <p className="text-sm text-gray-600">Returned Loans</p>
//             <p className="text-2xl font-bold text-purple-600">
//               {stats.myReturnedLoans}
//             </p>
//           </Card>
//           <Card className="p-4">
//             <p className="text-sm text-gray-600">Overdue Loans</p>
//             <p
//               className={`text-2xl font-bold ${
//                 stats.myOverdueLoans > 0 ? "text-red-600" : "text-gray-400"
//               }`}
//             >
//               {stats.myOverdueLoans}
//             </p>
//           </Card>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card className="p-6">
//             <h2 className="text-lg font-semibold mb-4">Loan Status</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={stats.myLoanStatusChart}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, value }) => `${name}: ${value}`}
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {stats.myLoanStatusChart.map((_, index) => (
//                     <Cell
//                       key={`cell-${index}`}
//                       fill={COLORS[index % COLORS.length]}
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </Card>

//           <Card className="p-6">
//             <h2 className="text-lg font-semibold mb-4">Loan Breakdown</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={stats.myLoanStatusChart}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="value" fill="#3b82f6" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/dashboard-stats`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        Loading your baddie dashboard 💅
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Member Dashboard ✨
        </h1>
        <p className="text-gray-500">
          Track your books, returns & overdue drama
        </p>
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

        <div className="h-[300px]">
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

/* ----------------------- */
/* STAT CARD COMPONENT */
/* ----------------------- */

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
