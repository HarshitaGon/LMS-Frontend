"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  profileImage?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const authContext = useAuth();
  const user = authContext?.user;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchProfile();
  }, [user, router]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (user) {
        try {
          const res = await apiRequest(
            `/users?email=${encodeURIComponent(user.email)}`,
            "GET",
            undefined,
            user.token,
          );

          const found = Array.isArray(res) && res.length > 0 ? res[0] : null;

          const nameFromBackend = found?.name || null;

          setProfile({
            id: found?.id || "",
            name: nameFromBackend || deriveNameFromEmail(user.email),
            email: user.email,
            role: user.role,
            createdAt: found?.createdAt || new Date().toISOString(),
            profileImage: found?.profileImage || undefined,
          });
        } catch (err) {
          setProfile({
            id: "",
            name: deriveNameFromEmail(user.email),
            email: user.email,
            role: user.role,
            createdAt: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const previewUrl = URL.createObjectURL(file);
    setProfile((prev) => (prev ? { ...prev, profileImage: previewUrl } : prev));

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/upload-avatar`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              profileImage: `${data.profileImage}?t=${Date.now()}`,
            }
          : prev,
      );
    } catch (err) {
      console.error("Image upload failed", err);
      fetchProfile();
    } finally {
      setUploading(false);
    }
  };

  function deriveNameFromEmail(email: string) {
    if (!email) return "";
    const local = email.split("@")[0] || "";
    return local
      .replace(/[._+-]+/g, " ")
      .split(" ")
      .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : ""))
      .join(" ");
  }

  if (!user) {
    return <div className="text-center py-12">Redirecting...</div>;
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : "N/A";
  const normalizedRole = profile?.role?.toUpperCase() || "MEMBER";
  const roleDisplay = normalizedRole === "ADMIN" ? "Administrator" : "Member";
  const roleBadgeColor =
    normalizedRole === "ADMIN"
      ? "bg-red-100 text-red-800"
      : "bg-blue-100 text-blue-800";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border">
              {profile?.profileImage ? (
                <img
                  src={
                    profile.profileImage.startsWith("blob:")
                      ? profile.profileImage
                      : `${process.env.NEXT_PUBLIC_API_URL}${profile.profileImage}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-3xl font-bold text-gray-600">
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <p className="text-xl font-semibold">{profile?.name}</p>
          </div>

          <label className="cursor-pointer text-sm text-blue-600 hover:underline">
            {uploading ? "Uploading..." : "Change profile photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="text-lg font-semibold">{profile?.name}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-lg font-semibold break-all">
                {profile?.email}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Role</p>
              <p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${roleBadgeColor}`}
                >
                  {roleDisplay}
                </span>
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Member Since</p>
              <p className="text-lg font-semibold">{joinedDate}</p>
            </div>
          </div>

          <div className="mt-8 p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
            <h3 className="font-semibold mb-2">Your Account Type</h3>
            {normalizedRole === "ADMIN" ? (
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✓ Create, edit, and delete books</li>
                <li>✓ View all loans in the system</li>
                <li>✓ Manage users</li>
              </ul>
            ) : (
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✓ Browse and search books</li>
                <li>✓ Borrow books from the library</li>
                <li>✓ Return borrowed books</li>
                <li>✓ View your loan history</li>
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
