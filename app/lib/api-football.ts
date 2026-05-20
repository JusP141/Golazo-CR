const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = "https://v3.football.api-sports.io";
export const LIGA_CR_ID = 162;
export const SEASON = 2024;

export async function fetchFootball(
  endpoint: string,
  params: Record<string, string>,
) {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      "x-apisports-key": API_KEY!,
    },
    next: { revalidate: 3600 },
  });

  const remaining = res.headers.get("x-ratelimit-requests-remaining");
  console.log(`⚽ API requests restantes hoy: ${remaining}`);

  return res.json();
}
