'use client';

import { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';

interface ImageItem {
  id: string;
  previewUrl: string;
  name: string;
  file: File;
  uploadedUrl?: string;
  uploading?: boolean;
}

export interface PropertyImageUploadHandle {
  uploadAll: () => Promise<string[]>;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 12;

const PropertyImageUpload = forwardRef<PropertyImageUploadHandle>(function PropertyImageUpload(_, ref) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [coverId, setCoverId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    setError(null);

    const accepted: ImageItem[] = [];
    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Este formato de imagem não é suportado. Utilize JPG, JPEG, PNG ou WEBP.');
        continue;
      }
      if (file.size > MAX_SIZE) {
        setError('A imagem é demasiado grande. Escolha uma imagem de menor tamanho.');
        continue;
      }

      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        file
      });
    }

    if (accepted.length > 0) {
      setImages((prev) => {
        const next = [...prev, ...accepted].slice(0, MAX_IMAGES);
        if (next.length > 0 && !coverId) {
          setCoverId(next[0].id);
        }
        return next;
      });
    }
  }, [coverId]);

  useImperativeHandle(ref, () => ({
    uploadAll
  }));

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files);
    e.target.value = '';
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      if (coverId === id) {
        setCoverId(next[0]?.id ?? null);
      }
      return next;
    });
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function uploadAll(): Promise<string[]> {
    const pending = images.filter((img) => !img.uploadedUrl);
    if (pending.length === 0) {
      return images.map((img) => img.uploadedUrl!).filter(Boolean);
    }

    setUploading(true);
    try {
      const urls: string[] = [];
      for (const img of pending) {
        const formData = new FormData();
        formData.append('file', img.file);

        const res = await fetch('/api/v1/upload', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error?.message ?? 'Erro ao enviar imagem.');
        }

        urls.push(data.data.url);
        setImages((prev) =>
          prev.map((i) => (i.id === img.id ? { ...i, uploadedUrl: data.data.url, uploading: false } : i))
        );
      }
      return urls;
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary"
          disabled={uploading}
        >
          {uploading ? 'A enviar...' : '+ Adicionar fotografias'}
        </button>
        <p className="text-xs text-slate-500">
          JPG, PNG ou WEBP · Máx. 5MB · {images.length}/{MAX_IMAGES}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {images.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-500">Adicione fotografias do imóvel</p>
          <p className="mt-1 text-xs text-slate-400">
            Pode escolher várias imagens ao mesmo tempo, da galeria ou da câmara do seu dispositivo.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary mt-4"
          >
            Escolher imagens
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, idx) => (
            <div key={img.id} className="group relative overflow-hidden rounded-xl border border-slate-200">
              <img src={img.previewUrl} alt={`Fotografia ${idx + 1}`} className="aspect-square w-full object-cover" />
              {img.id === coverId && (
                <span className="absolute left-2 top-2 badge-green">Capa</span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-black/60 p-1.5">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(idx, -1)}
                    disabled={idx === 0 || uploading}
                    className="rounded bg-white/20 px-1.5 text-white transition-colors hover:bg-white/40 disabled:opacity-30"
                    aria-label="Mover para a esquerda"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(idx, 1)}
                    disabled={idx === images.length - 1 || uploading}
                    className="rounded bg-white/20 px-1.5 text-white transition-colors hover:bg-white/40 disabled:opacity-30"
                    aria-label="Mover para a direita"
                  >
                    →
                  </button>
                </div>
                <div className="flex gap-1">
                  {img.id !== coverId && (
                    <button
                      type="button"
                      onClick={() => setCoverId(img.id)}
                      disabled={uploading}
                      className="rounded bg-white/20 px-1.5 text-xs text-white transition-colors hover:bg-white/40"
                      aria-label="Definir como capa"
                    >
                      Capa
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    disabled={uploading}
                    className="rounded bg-red-500/70 px-1.5 text-white transition-colors hover:bg-red-600"
                    aria-label="Remover imagem"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Campos ocultos para o formulário */}
      <input type="hidden" name="coverImageIndex" value={images.findIndex((img) => img.id === coverId).toString()} />
      <input type="hidden" name="images" value={images.map((img) => img.uploadedUrl ?? '').join('\n')} />
      <input type="hidden" name="pendingImages" value={images.filter((img) => !img.uploadedUrl).length.toString()} />
    </div>
  );
});

export default PropertyImageUpload;
