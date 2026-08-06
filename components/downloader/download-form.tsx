import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useExtract } from "@/hooks/use-extract"
import { validateUrlAction } from "@/actions/validation"
import { toast } from "sonner"
import { VideoInfo } from "./video-info"

const formSchema = z.object({
  url: z.string().url("Format URL tidak valid"),
})

type FormValues = z.infer<typeof formSchema>

export function DownloadForm() {
  const extract = useExtract()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    const validation = await validateUrlAction(data.url)
    if (!validation.success) {
      toast.error(validation.error)
      return
    }
    
    extract.mutate(data.url, {
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        setValue("url", text, { shouldValidate: true })
      }
    } catch {
      toast.error("Gagal membaca clipboard")
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="url" className="font-mono text-[18px] uppercase tracking-[0.54px]">URL Video VDY</Label>
          <div className="relative flex items-center">
            <Input
              id="url"
              placeholder="https://vdy.to/e/..."
              className="pr-24"
              disabled={extract.isPending}
              {...register("url")}
            />
            <Button
              type="button"
              variant="tertiary-text"
              className="absolute right-2"
              onClick={handlePaste}
              disabled={extract.isPending}
            >
              Paste
            </Button>
          </div>
          {errors.url && (
            <span className="text-destructive font-sans text-[16px]">{errors.url.message}</span>
          )}
        </div>
        <Button type="submit" variant="primary" disabled={extract.isPending} className="self-start">
          {extract.isPending ? "Memproses..." : "Ekstrak Video"}
        </Button>
      </form>

      {extract.isPending && (
        <div className="w-full h-[200px] bg-muted animate-pulse rounded-lg" />
      )}

      {extract.data && (
        <VideoInfo data={extract.data} />
      )}
    </div>
  )
}