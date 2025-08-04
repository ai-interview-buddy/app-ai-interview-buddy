export async function isUrlReachable(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.status === 200;
  } catch (err) {
    console.error(`Failed to fetch ${url}:`, err);
    return false;
  }
}
