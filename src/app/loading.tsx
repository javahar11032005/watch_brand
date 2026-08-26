export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 rounded-full border border-taupe border-t-brass animate-spin" />
      <p className="text-xs tracking-[0.25em] uppercase text-slate">Kestrel</p>
    </div>
  );
}
