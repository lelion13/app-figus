import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import InstallPrompt from "../components/InstallPrompt";
import MissingChoiceModal from "../components/MissingChoiceModal";
import ProgressBar from "../components/ProgressBar";
import TeamLabel from "../components/TeamLabel";
import { shareMissingList } from "../utils/shareMissing";
import {
  api,
  type CatalogResponse,
  type Progress,
  type UserStickerState,
} from "../services/api";
import { filterTeamsByQuery } from "../utils/searchTeams";

export default function TeamsPage() {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
  const [ownedMap, setOwnedMap] = useState<Record<number, boolean>>({});
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [faltanOpen, setFaltanOpen] = useState(false);
  const [faltanBusy, setFaltanBusy] = useState(false);
  const [albumCompleteMsg, setAlbumCompleteMsg] = useState("");
  const [shareNotice, setShareNotice] = useState("");

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

  const filteredTeams = useMemo(() => {
    if (!catalog) return [];
    return filterTeamsByQuery(catalog, teamStats, search);
  }, [catalog, teamStats, search]);

  function handleFaltanTap() {
    if (!progress) return;
    setShareNotice("");
    if (progress.missing === 0) {
      setAlbumCompleteMsg("¡Completaste el álbum!");
      return;
    }
    setAlbumCompleteMsg("");
    setFaltanOpen(true);
  }

  async function handleShareWhatsApp() {
    setFaltanBusy(true);
    setShareNotice("");
    try {
      const missing = await api.getMissing();
      const result = await shareMissingList(missing.teams);
      if (result === "cancelled") return;
      setFaltanOpen(false);
      if (result === "shared") {
        setShareNotice("Elegí WhatsApp en el menú para enviar tu listado.");
      } else if (result === "whatsapp") {
        setShareNotice("Se abrió WhatsApp con tu listado.");
      } else if (result === "file") {
        setShareNotice(
          "Elegí WhatsApp y enviá el archivo de texto con tu listado.",
        );
      } else {
        setShareNotice(
          "No se pudo abrir WhatsApp en este dispositivo. El listado se copió al portapapeles.",
        );
      }
    } catch (err) {
      setShareNotice(
        err instanceof Error ? err.message : "No se pudo compartir el listado",
      );
    } finally {
      setFaltanBusy(false);
    }
  }

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
    <Layout title="Equipos" onFaltan={handleFaltanTap}>
      <div className="space-y-4">
        <ProgressBar progress={progress} />
        {albumCompleteMsg && (
          <p className="rounded-2xl bg-green-50 px-4 py-3 text-center font-semibold text-green-800 ring-1 ring-green-200">
            {albumCompleteMsg}
          </p>
        )}
        {shareNotice && (
          <p className="rounded-2xl bg-slate-100 px-4 py-3 text-center text-sm text-slate-700 ring-1 ring-slate-200">
            {shareNotice}
          </p>
        )}
        <InstallPrompt />
        <label className="block">
          <span className="sr-only">Buscar país o figurita</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar país o figurita…"
            autoComplete="off"
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base shadow-sm ring-slate-200 placeholder:text-slate-400 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30"
          />
        </label>
        {filteredTeams.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-6 text-center text-slate-600 shadow-sm ring-1 ring-slate-200">
            No hay equipos que coincidan con tu búsqueda.
          </p>
        ) : (
          <ul className="space-y-3">
            {filteredTeams.map((item) => (
              <li key={item.team}>
                <Link
                  to={`/equipos/${encodeURIComponent(item.team)}`}
                  className="flex min-h-[3.5rem] items-center justify-between rounded-2xl bg-white px-4 py-4 text-lg font-semibold shadow-sm ring-1 ring-slate-200 active:scale-[0.99]"
                >
                  <TeamLabel team={item.team} className="min-w-0 flex-1 pr-2" />
                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                    {item.obtained}/{item.total}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <MissingChoiceModal
        open={faltanOpen}
        onClose={() => setFaltanOpen(false)}
        onViewScreen={() => {
          setFaltanOpen(false);
          navigate("/faltan");
        }}
        onShareWhatsApp={handleShareWhatsApp}
        busy={faltanBusy}
      />
    </Layout>
  );
}
