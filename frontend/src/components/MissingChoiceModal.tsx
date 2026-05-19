type Props = {
  open: boolean;
  onClose: () => void;
  onViewScreen: () => void;
  onShareWhatsApp: () => void;
  busy?: boolean;
};

export default function MissingChoiceModal({
  open,
  onClose,
  onViewScreen,
  onShareWhatsApp,
  busy = false,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="faltan-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="faltan-title" className="mb-1 text-xl font-bold text-slate-900">
          Figuritas que faltan
        </h2>
        <p className="mb-4 text-sm text-slate-600">
          Elegí cómo querés ver o compartir tu listado.
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={onViewScreen}
            disabled={busy}
            className="w-full rounded-xl bg-green-600 py-4 text-base font-bold text-white disabled:opacity-60"
          >
            Ver en pantalla
          </button>
          <button
            type="button"
            onClick={onShareWhatsApp}
            disabled={busy}
            className="w-full rounded-xl bg-[#25D366] py-4 text-base font-bold text-white disabled:opacity-60"
          >
            Compartir por WhatsApp
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-700 disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
