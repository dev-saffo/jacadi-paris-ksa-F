import { useEffect, useState, type ImgHTMLAttributes } from "react";

type ProductImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src?: string | null;
};

export function ProductImage({ src, alt, onError, ...props }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const fallbackSrc = `${import.meta.env.BASE_URL}placeholder.svg`;

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <img
      {...props}
      src={!src || hasError ? fallbackSrc : src}
      alt={alt ?? ""}
      onError={(event) => {
        setHasError(true);
        onError?.(event);
      }}
    />
  );
}
