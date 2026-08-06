import { useMutation } from "@tanstack/react-query";
import { extractVideo } from "../services/api";
import { ExtractResponse } from "../types/api";

export function useExtract() {
  return useMutation<ExtractResponse, Error, string>({
    mutationFn: (url: string) => extractVideo(url),
  });
}
