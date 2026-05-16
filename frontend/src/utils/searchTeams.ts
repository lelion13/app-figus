import type { CatalogResponse, TeamGroup } from "../services/api";

export type TeamStat = {
  team: string;
  obtained: number;
  total: number;
};

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function teamMatchesQuery(group: TeamGroup, query: string): boolean {
  if (normalize(group.team).includes(query)) {
    return true;
  }

  return group.stickers.some((sticker) => {
    const code = normalize(sticker.code);
    if (code.includes(query)) {
      return true;
    }
    if (/^\d+$/.test(query)) {
      if (String(sticker.number) === query) {
        return true;
      }
      if (code.endsWith(query)) {
        return true;
      }
    }
    return false;
  });
}

export function filterTeamsByQuery(
  catalog: CatalogResponse,
  teamStats: TeamStat[],
  rawQuery: string,
): TeamStat[] {
  const query = normalize(rawQuery.trim());
  if (!query) {
    return teamStats;
  }

  const groupByName = new Map(catalog.teams.map((g) => [g.team, g]));

  return teamStats.filter((item) => {
    const group = groupByName.get(item.team);
    if (!group) {
      return normalize(item.team).includes(query);
    }
    return teamMatchesQuery(group, query);
  });
}
