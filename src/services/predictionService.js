import { apiFetch } from "./apiService";

// POST — analyze a network flow and predict its class
export async function predictFlow(inputData) {
  return apiFetch("/api/ml/analyze", {
    method: "POST",
    body: JSON.stringify(inputData)
  });
}
