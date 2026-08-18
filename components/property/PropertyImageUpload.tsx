'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageItem {
  id: string;
  dataUrl: string;
  name: string;
  file: File;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGES = 12;

export default function PropertyImageUpload() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [coverId, setCoverId] = useState<string | null>(null);
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

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        accepted.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          dataUrl,
          name: file.name,
          file
        });

        if (accepted.length === files.length) {
          setImages((prev) => {
            const next = [...prev, ...accepted].slice(0, MAX_IMAGES);
            if (next.length > 0 && !coverId) {
              setCoverId(next[0].id);
            }
            return next;
          });
        }
      };
      reader.readAsDataURL(file);
    }

    if (files.length === 0) {
      setImages([]);
    }
  }, [coverId]);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary"
        >
          + Adicionar fotografias
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
              <img src={img.dataUrl} alt={`Fotografia ${idx + 1}`} className="aspect-square w-full object-cover" />
              {img.id === coverId && (
                <span className="absolute left-2 top-2 badge-green">Capa</span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-black/60 p-1.5">
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(idx, -1)}
                    disabled={idx === 0}
                    className="rounded bg-white/20 px-1.5 text-white transition-colors hover:bg-white/40 disabled:opacity-30"
                    aria-label="Mover para a esquerda"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(idx, 1)}
                    disabled={idx === images.length - 1}
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
                      className="rounded bg-white/20 px-1.5 text-xs text-white transition-colors hover:bg-white/40"
                      aria-label="Definir como capa"
                    >
                      Capa
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
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

      {/* Campo oculto para enviar as imagens no formulário */}
      <input type="hidden" name="imagesData" value={JSON.stringify(images.map((img) => img.dataUrl))} />
      <input type="hidden" name="coverImageIndex" value={images.findIndex((img) => img.id === coverId).toString()} />
    </div>
  );
}