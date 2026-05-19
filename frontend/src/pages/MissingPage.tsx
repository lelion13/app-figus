import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import TeamLabel from "../components/TeamLabel";
import { api, type MissingStickersResponse } from "../services/api";

export default function MissingPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<MissingStickersResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setData(await api.getMissing());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Layout
      title="Me faltan"
      onBack={() => navigate("/equipos")}
    >
      {loading && <p className="text-center text-slate-600">Cargando…</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && data && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {data.total_missing} figurita{data.total_missing === 1 ? "" : "s"} sin
            tener
          </p>
          {data.teams.length === 0 ? (
            <p className="rounded-2xl bg-white px-4 py-6 text-center font-semibold text-green-700 shadow-sm ring-1 ring-slate-200">
              ¡Completaste el álbum!
            </p>
          ) : (
            <ul className="space-y-3">
              {data.teams.map((group) => (
                <li
                  key={group.team}
                  className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200"
                >
                  <div className="flex flex-wrap items-baseline gap-x-1 gap-y-1">
                    <TeamLabel team={group.team} className="font-semibold" />
                    <span className="text-slate-400">:</span>
                    <span className="font-mono text-slate-800">
                      {group.codes.join(", ")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Layout>
  );
}
