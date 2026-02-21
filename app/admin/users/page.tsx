"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash } from "lucide-react";
import Fuse from "fuse.js";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const authContext = useAuth();
  const user = authContext?.user;
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!searchEmail.trim()) {
      setUsers(allUsers);
      return;
    }

    const fuse = new Fuse(allUsers, {
      keys: ["email", "name"],
      threshold: 0.3,
      ignoreLocation: true,
    });

    setUsers(fuse.search(searchEmail).map((r) => r.item));
  }, [searchEmail, allUsers]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "ADMIN" && user.role !== "admin") {
      router.push("/books");
      return;
    }

    fetchUsers();
  }, [user, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (!user?.token) {
        toast.error("Not authenticated");
        return;
      }

      const data = await apiRequest("/users", "GET", undefined, user.token);
      const list = Array.isArray(data) ? data : [];

      setAllUsers(list);
      setUsers(list);
    } catch (error) {
      toast.error("Failed to fetch users");
      setAllUsers([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    if (!user?.token) {
      toast.error("Not authenticated");
      return;
    }

    setDeletingId(userId);
    try {
      await apiRequest(`/users/${userId}`, "DELETE", undefined, user.token);
      toast.success("User deleted successfully");

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setAllUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to delete user";
      toast.error(errorMsg);
    } finally {
      setDeletingId(null);
    }
  };

  if (!user || (user.role !== "ADMIN" && user.role !== "admin")) {
    return <div className="text-center py-12">Access Denied</div>;
  }

  const stats = {
    totalUsers: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    members: users.filter((u) => u.role === "MEMBER").length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">User Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Admins</p>
              <p className="text-3xl font-bold text-red-600">{stats.admins}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm">Members</p>
              <p className="text-3xl font-bold text-blue-600">
                {stats.members}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-lg flex gap-4">
        <Input
          placeholder="Search by email or name..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="flex-1"
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSearchEmail("");
            setUsers(allUsers);
          }}
        >
          Clear
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No users found. Try adjusting your search.
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 px-4 font-semibold">Name</th>
                    <th className="text-left py-2 px-4 font-semibold">Email</th>
                    <th className="text-left py-2 px-4 font-semibold">Role</th>
                    <th className="text-left py-2 px-4 font-semibold">
                      Joined
                    </th>
                    <th className="text-center py-2 px-4 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{u.name}</td>
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            u.role === "ADMIN"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          variant="destructive"
                          size="sm"
                          disabled={deletingId === u.id}
                        >
                          {deletingId === u.id ? (
                            "Deleting..."
                          ) : (
                            <div className="flex gap-2 justify-center items-center">
                              <Trash />
                              <p>Delete</p>
                            </div>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
