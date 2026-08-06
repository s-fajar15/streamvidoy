import * as React from "react"
import { useHistory } from "@/hooks/use-history"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatBytes } from "@/lib/utils"

export function HistoryList() {
  const { history, isLoading, clearHistory, isClearing } = useHistory()

  if (isLoading) {
    return <div className="w-full h-[100px] bg-muted animate-pulse rounded-lg" />
  }

  if (history.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center border border-dashed rounded-lg text-muted-foreground">
        <span className="font-sans text-[18px] font-[320]">Belum ada riwayat unduhan.</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6" id="history">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-[26px] font-[540] tracking-[-0.26px]">Riwayat Unduhan</h2>
        <Button
          variant="tertiary-text"
          onClick={() => clearHistory()}
          disabled={isClearing}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          Hapus Semua
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.map((item) => (
          <Card key={item.id} className="bg-surface-soft border-none overflow-hidden flex flex-col">
            {item.poster && (
              <div className="w-full aspect-video relative bg-background">
                <img
                  src={item.poster}
                  alt={item.title || "Thumbnail"}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <CardContent className="p-4 flex flex-col flex-1 gap-2">
              <h3 className="font-sans text-[18px] font-[700] line-clamp-2">
                {item.title || item.videoId}
              </h3>
              <div className="mt-auto flex items-center justify-between text-muted-foreground">
                <span className="font-mono text-[12px] uppercase tracking-[0.60px]">
                  {new Date(item.timestamp).toLocaleDateString("id-ID")}
                </span>
                <span className="font-mono text-[12px] uppercase tracking-[0.60px]">
                  {formatBytes(item.fileSize)}
                </span>
              </div>
              <div className="mt-4">
                 <Button variant="secondary" asChild className="w-full">
                    <a href={`/api/download/${item.videoId}`} download>
                      Unduh Ulang
                    </a>
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}