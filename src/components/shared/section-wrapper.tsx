/**
 * Consistent section wrapper with max-width and padding.
 * Every page section uses this to maintain visual consistency.
 */
export function SectionWrapper({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 ${className}`}
    >
      {children}
    </section>
  );
}
