export const apiRequest = async ({ method, url, body, params }: any) => {
  const baseUrl = "https://your-api-endpoint.com"; // Replace with your actual API URL
  const headers = {
    "Content-Type": "application/json",
  };

  let fullUrl = `${baseUrl}${url}`;
  if (params) {
    const queryParams = new URLSearchParams(params).toString();
    fullUrl += `?${queryParams}`;
  }

  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(fullUrl, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    throw new Error("Network error");
  }
};
