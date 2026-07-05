export function AmbientBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-ghost-mesh opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-grain opacity-40" />
    </>
  );
}
