import { API_URL } from "@/shared/config/constats";

const API_KEY_ENDPOINT = "/config/api-key";

export async function setApiKey(key: string): Promise<void> {
  const response = await fetch(`${API_URL}${API_KEY_ENDPOINT}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: key }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to save API key");
  }
}
