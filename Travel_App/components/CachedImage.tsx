import { Image } from "expo-image";
import React from "react";

interface CachedImageProps {
  uri: string;
  style?: any;
  contentFit?: "cover" | "contain" | "fill" | "scale-down";
  placeholder?: any;
}

export function CachedImage({ uri, style, contentFit = "cover", placeholder }: CachedImageProps) {
  return (
    <Image
      source={{ uri }}
      style={style}
      contentFit={contentFit}
      cachePolicy="memory-disk"
      placeholder={placeholder}
      transition={200}
    />
  );
}
