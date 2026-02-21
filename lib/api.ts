const API = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body?: Record<string, unknown>,
  token?: string
) {
  const url = `${API}${endpoint}`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    let data: any = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = null;
    }

    if (!res.ok) {
      const errorMessage = data?.message || data?.error || text || res.statusText || "Request failed";
      const error = new Error(errorMessage);
      (error as any).status = res.status;
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error: Unable to connect to server");
  }
}
