export function SkeletonBlock({
  lines = 4,
  width = "100%",
}: {
  lines?: number;
  width?: string;
}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-[#bdae93] animate-pulse"
          style={{ width }}
        />
      ))}
    </div>
  );
}
