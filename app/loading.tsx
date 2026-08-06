export default function Loading() {
  return (
    <main className="flex-1 w-full max-w-[1280px] mx-auto min-h-screen p-lg flex flex-col animate-pulse">
      <div className="h-[56px] bg-muted rounded-xs w-full mb-lg" />
      <div className="h-[36px] bg-muted rounded-xs w-full mb-section" />
      <div className="h-[400px] bg-muted rounded-lg w-full mb-section" />
      <div className="h-[300px] bg-muted rounded-lg w-full mb-section" />
    </main>
  );
}
