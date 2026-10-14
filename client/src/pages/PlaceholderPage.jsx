/** Temporary page for modules that are not built yet. Replace with the real page. */
export default function PlaceholderPage({ title, issues }) {
  return (
    <section>
      <h1>{title}</h1>
      <p className="muted">Coming soon{issues ? ` (${issues})` : ''}.</p>
    </section>
  );
}
