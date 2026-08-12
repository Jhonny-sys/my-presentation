"use client";

type Props = {
  label: string;
  accept?: string;
  previewUrl?: string;
  onUploaded: (url: string) => void;
  uploading?: boolean;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  upload: (file: File) => Promise<string>;
};

export function FileUploadField({
  label,
  accept = "image/*",
  previewUrl,
  onUploaded,
  uploading,
  onUploadStart,
  onUploadEnd,
  upload,
}: Props) {
  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    onUploadStart?.();
    try {
      const url = await upload(file);
      onUploaded(url);
    } finally {
      onUploadEnd?.();
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm text-white/60">{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
        className="block w-full text-sm text-white/70 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-400/20 file:px-3 file:py-2 file:text-cyan-200"
      />
      {previewUrl && (
        previewUrl.toLowerCase().includes(".pdf") ? (
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm text-cyan-300 underline hover:text-cyan-200"
          >
            Ver archivo PDF
          </a>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="" className="h-16 w-16 rounded-lg object-cover" />
        )
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-cyan-400/40";

const labelClass = "block text-sm text-white/60 mb-1";

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export { inputClass };
