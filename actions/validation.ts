"use server";

import { z } from "zod";

const urlSchema = z.object({
  url: z.string().url("Format URL tidak valid"),
});

export async function validateUrlAction(url: string) {
  const parsed = urlSchema.safeParse({ url });
  
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }
  
  const urlObj = new URL(url);
  
  if (!urlObj.hostname.includes("streamrizz.com")) {
    return {
      success: false,
      error: "Domain tidak didukung. Harap gunakan URL dari streamrizz.com",
    };
  }
  
  return { success: true, error: null };
}
