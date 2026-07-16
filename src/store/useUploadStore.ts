import { create } from "zustand";
import type { UploadedImage } from "@/types";

interface UploadState {
  image: UploadedImage | null;
  setImage: (image: UploadedImage) => void;
  clearImage: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  image: null,
  setImage: (image) => set({ image }),
  clearImage: () =>
    set((state) => {
      if (state.image) {
        URL.revokeObjectURL(state.image.previewUrl);
      }
      return { image: null };
    }),
}));
