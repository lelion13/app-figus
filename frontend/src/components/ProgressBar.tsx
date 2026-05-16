import type { Progress } from "../services/api";

type Props = {
  progress: Progress;
};

export default function ProgressBar({ progress }: Props) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-2 flex items-center justify-between text-sm font-medium">
        <span>Completado</span>
        <span>{progress.percent}%</span>
      </div>
      <div className="mb-3 h-3 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-green-600 transition-all duration-300"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <p className="text-slate-500">Total</p>
          <p className="text-lg font-bold">{progress.total}</p>
        </div>
        <div>
          <p className="text-slate-500">Obtenidas</p>
          <p className="text-lg font-bold text-green-700">{progress.obtained}</p>
        </div>
        <div>
          <p className="text-slate-500">Me faltan</p>
          <p className="text-lg font-bold">{progress.missing}</p>
        </div>
      </div>
    </section>
  );
}
