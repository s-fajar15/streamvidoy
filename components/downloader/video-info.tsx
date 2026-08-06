import * as React from "react"
import { ExtractResponse } from "@/types/api"
import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useDownload } from "@/hooks/use-download"
import { formatBytes, formatTime } from "@/lib/utils"
import { toast } from "sonner"

interface VideoInfoProps {
  data: ExtractResponse
}

export function VideoInfo({ data }: VideoInfoProps) {
  const download = useDownload()

  const handleStartDownload = () => {
    if (!data.urlCdn) {
      toast.error("URL CDN tidak ditemukan")
      return
    }
    download.startDownload(data.urlCdn, data.idVideo, data.title, data.poster)
  }

  return (
    <Card className="w-full bg-surface-soft border-none">
      <div className="flex flex-col md:flex-row gap-6 p-6">
        {data.poster && (
          <div className="w-full md:w-1/3 aspect-video relative rounded-md overflow-hidden bg-background">
            <img
              src={data.poster}
              alt={data.title || "Thumbnail"}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <CardTitle className="line-clamp-2">{data.title || "Video Tanpa Judul"}</CardTitle>
            <CardDescription className="mt-2 font-mono uppercase tracking-[0.54px]">
              ID: {data.idVideo} • Host: {data.nameHost}
            </CardDescription>
          </div>

          {download.status === "idle" && (
            <Button onClick={handleStartDownload} variant="primary" className="self-start mt-auto">
              Unduh Sekarang
            </Button>
          )}

          {download.status === "downloading" && (
            <div className="flex flex-col gap-2 mt-auto">
              <div className="flex justify-between items-center font-mono text-[12px] uppercase tracking-[0.60px]">
                <span>{download.progress.toFixed(1)}%</span>
                <span>
                  {formatBytes(download.downloadedSize)} / {formatBytes(download.totalSize)}
                </span>
              </div>
              <Progress value={download.progress} />
              <div className="flex justify-between items-center font-mono text-[12px] uppercase tracking-[0.60px] text-muted-foreground">
                <span>{formatBytes(download.speed)}/s</span>
                <span>ETA: {formatTime(download.eta)}</span>
              </div>
            </div>
          )}

          {download.status === "completed" && (
            <div className="flex flex-col gap-4 mt-auto">
              <div className="bg-semantic-success text-on-primary px-4 py-2 rounded-md font-sans text-[16px] font-[480]">
                Unduhan Selesai
              </div>
              <Button variant="secondary" asChild className="self-start">
                <a href={`/api/download/${download.downloadedFileId}`} download>
                  Simpan File
                </a>
              </Button>
            </div>
          )}

          {download.status === "error" && (
            <div className="flex flex-col gap-4 mt-auto">
              <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md font-sans text-[16px] font-[480]">
                {download.error}
              </div>
              <Button onClick={download.resetDownload} variant="secondary" className="self-start">
                Coba Lagi
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}