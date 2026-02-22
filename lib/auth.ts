export const getToken = () => {
  //   if (typeof window !== "undefined") {
  //     return localStorage.getItem("accessToken");
  //   }
  //   return null;

  const storedUser = localStorage.getItem("user");

  if (!storedUser) throw new Error("User not logged in");

  const { token } = JSON.parse(storedUser);

  return token;
};
