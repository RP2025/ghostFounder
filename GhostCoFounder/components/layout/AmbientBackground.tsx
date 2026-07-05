/**
 * Ambient, always-moving backdrop: three large blurred gradient "aurora" blobs
 * that drift slowly, plus a fine grain overlay. Purely decorative and
 * non-interactive; respects prefers-reduced-motion (animations are neutralized
 * globally in that case).
 */
export function AmbientBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-[15%] -top-[20%] h-[65vh] w-[65vh] rounded-full bg-ghost-violet/30 blur-[130px] animate-aurora-1" />
        <div className="absolute -right-[15%] top-[25%] h-[60vh] w-[60vh] rounded-full bg-ghost-blue/25 blur-[130px] animate-aurora-2" />
        <div className="absolute bottom-[-20%] left-[25%] h-[55vh] w-[55vh] rounded-full bg-ghost-cyan/20 blur-[130px] animate-aurora-3" />
      </div>
      <div className="pointer-events-none fixed inset-0 bg-grain opacity-40" />
    </>
  );
}
