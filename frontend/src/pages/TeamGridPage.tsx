import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import ProgressBar from "../components/ProgressBar";
import TeamLabel from "../components/TeamLabel";
import {
  api,
  type CatalogResponse,
  type Progress,
  type StickerItem,
} from "../services/api";

export default function TeamGridPage() {
  const { teamName = "" } = useParams();
  const team = decodeURIComponent(teamName);
  const navigate = useNavigate();

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
        myData.items.forEach((item) => {
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
  }, [team]);

  const stickers: StickerItem[] = useMemo(() => {
    const group = catalog?.teams.find((t) => t.team === team);
    return group?.stickers ?? [];
  }, [catalog, team]);

  async function toggleSticker(stickerId: number) {
    const previous = ownedMap[stickerId] ?? false;
    const next = !previous;
    setOwnedMap((current) => ({ ...current, [stickerId]: next }));
    if (progress) {
      const delta = next ? 1 : -1;
      const obtained = Math.max(0, progress.obtained + delta);
      const missing = Math.max(0, progress.total - obtained);
      const percent = progress.total
        ? Math.round((obtained / progress.total) * 1000) / 10
        : 0;
      setProgress({ ...progress, obtained, missing, percent });
    }
    try {
      const result = await api.toggleSticker(stickerId);
      setOwnedMap((current) => ({ ...current, [stickerId]: result.owned }));
      const fresh = await api.getProgress();
      setProgress(fresh);
    } catch {
      setOwnedMap((current) => ({ ...current, [stickerId]: previous }));
      if (progress) {
        const fresh = await api.getProgress();
        setProgress(fresh);
      }
    }
  }

  if (loading) {
    return (
      <Layout title={<TeamLabel team={team} />} onBack={() => navigate("/equipos")}>
        <p className="text-center text-slate-600">Cargando…</p>
      </Layout>
    );
  }

  if (error || !progress) {
    return (
      <Layout title={<TeamLabel team={team} />} onBack={() => navigate("/equipos")}>
        <p className="text-center text-red-600">{error || "Sin datos"}</p>
      </Layout>
    );
  }

  return (
    <Layout title={<TeamLabel team={team} />} onBack={() => navigate("/equipos")}>
      <div className="space-y-4">
        <ProgressBar progress={progress} />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-2">
          {stickers.map((sticker) => {
            const owned = ownedMap[sticker.id] ?? false;
            return (
              <button
                key={sticker.id}
                type="button"
                onClick={() => toggleSticker(sticker.id)}
                className={`min-h-11 rounded-xl px-1 py-3 text-xs font-bold leading-tight transition active:scale-95 ${
                  owned
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-slate-300 text-slate-800"
                }`}
                aria-pressed={owned}
                aria-label={owned ? `La tengo: ${sticker.code}` : `No la tengo: ${sticker.code}`}
              >
                {sticker.code}
              </button>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
