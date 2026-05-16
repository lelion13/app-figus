import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ProgressBar from "../components/ProgressBar";
import {
  api,
  type CatalogResponse,
  type Progress,
  type UserStickerState,
} from "../services/api";

export default function TeamsPage() {
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [ownedMap, setOwnedMap] = useState<Record<number, boolean>>({});
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [catalogData, myData, progressData] = await Promise.all([
          api.getCatalog(),
          api.getMyStickers(),
          api.getProgress(),
        ]);
        setCatalog(catalogData);
        const map: Record<number, boolean> = {};
        myData.items.forEach((item: UserStickerState) => {
          map[item.sticker_id] = item.owned;
        });
        setOwnedMap(map);
        setProgress(progressData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const teamStats = useMemo(() => {
    if (!catalog) return [];
    return catalog.teams.map((group) => {
      const obtained = group.stickers.filter((s) => ownedMap[s.id]).length;
      return {
        team: group.team,
        obtained,
        total: group.stickers.length,
      };
    });
  }, [catalog, ownedMap]);

  if (loading) {
    return (
      <Layout title="Equipos">
        <p className="text-center text-slate-600">Cargando…</p>
      </Layout>
    );
  }

  if (error || !catalog || !progress) {
    return (
      <Layout title="Equipos">
        <p className="text-center text-red-600">{error || "Sin datos"}</p>
      </Layout>
    );
  }

  return (
    <Layout title="Equipos">
      <div className="space-y-4">
        <ProgressBar progress={progress} />
        <ul className="space-y-3">
          {teamStats.map((item) => (
            <li key={item.team}>
              <Link
                to={`/equipos/${encodeURIComponent(item.team)}`}
                className="flex min-h-[3.5rem] items-center justify-between rounded-2xl bg-white px-4 py-4 text-lg font-semibold shadow-sm ring-1 ring-slate-200 active:scale-[0.99]"
              >
                <span className="pr-2">{item.team}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                  {item.obtained}/{item.total}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
