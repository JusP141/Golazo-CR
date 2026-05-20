import { fetchFootball, LIGA_CR_ID, SEASON } from "./api-football";

export async function getPartidos() {
  const data = await fetchFootball("fixtures", {
    league: String(LIGA_CR_ID),
    season: String(SEASON),
  });
  return data.response ?? [];
}
