"use client";

import Image from "next/image";
import React from "react";
import { HardDriveUpload, ImagePlus, Trash2 } from "lucide-react";

import { Button, Card, CardContent } from "@/shared";

const ImageFieldManager = ({
  title,
  inputName = "newImages",
  existingImages,
  retainedImageIds,
  onRetainedImageIdsChange,
  newFiles,
  onNewFilesChange,
}) => {
  const toggleRetained = (imageId) => {
    if (retainedImageIds.includes(imageId)) {
      onRetainedImageIdsChange(retainedImageIds.filter((id) => id !== imageId));
      return;
    }

    onRetainedImageIdsChange([...retainedImageIds, imageId]);
  };

  const handleNewFiles = (event) => {
    onNewFilesChange(Array.from(event.target.files || []));
  };

  const removeNewFile = (fileName) => {
    onNewFilesChange(newFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div className="space-y-5 rounded-[28px] border border-border/65 bg-white/34 p-5 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.28)] dark:bg-white/[0.02]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-text">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-unactive-text">
            Images upload directly to the local server filesystem and stay attached to this record until you replace or archive them.
          </p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-border bg-surface px-4 py-3 text-sm text-text transition duration-200 hover:border-primary/50 hover:bg-[var(--admin-panel-muted)]">
          <ImagePlus className="h-4 w-4" />
          Upload images
          <input
            className="hidden"
            multiple
            name={inputName}
            type="file"
            accept="image/*"
            onChange={handleNewFiles}
          />
        </label>
      </div>
      <div className="grid gap-3 rounded-[24px] border border-border/60 bg-[var(--admin-panel-muted)]/62 p-4 md:grid-cols-3">
        <div className="rounded-[18px] bg-white/55 px-4 py-3 dark:bg-white/[0.03]">
          <p className="text-xs uppercase tracking-[0.18em] text-unactive-text">Storage</p>
          <p className="mt-1 text-sm font-medium text-text">Local server disk</p>
        </div>
        <div className="rounded-[18px] bg-white/55 px-4 py-3 dark:bg-white/[0.03]">
          <p className="text-xs uppercase tracking-[0.18em] text-unactive-text">Formats</p>
          <p className="mt-1 text-sm font-medium text-text">JPG, PNG, WebP</p>
        </div>
        <div className="rounded-[18px] bg-white/55 px-4 py-3 dark:bg-white/[0.03]">
          <p className="text-xs uppercase tracking-[0.18em] text-unactive-text">Limit</p>
          <p className="mt-1 text-sm font-medium text-text">5MB per file</p>
        </div>
      </div>
      {existingImages.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {existingImages.map((image) => {
            const retained = retainedImageIds.includes(image.id);
            return (
              <Card key={image.id} className="overflow-hidden rounded-[24px]">
                <div className="relative aspect-[4/3] bg-[var(--admin-panel-muted)]">
                  <Image fill src={image.url} alt="Product image" className="object-cover" />
                </div>
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-sm font-medium text-text">Image #{image.position || image.id}</p>
                    <p className="text-xs text-unactive-text">
                      {retained ? "Will be kept" : "Will be removed on save"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={retained ? "outline" : "danger"}
                    size="sm"
                    onClick={() => toggleRetained(image.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    {retained ? "Remove" : "Undo"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="rounded-[22px] border border-dashed border-border px-4 py-6 text-sm text-unactive-text">
          No uploaded images yet.
        </p>
      )}
      {newFiles.length > 0 ? (
        <div className="space-y-3 rounded-[24px] border border-border bg-surface/70 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-text">
            <HardDriveUpload className="h-4 w-4 text-primary" />
            New files ready to upload
          </div>
          <div className="space-y-3">
            {newFiles.map((file) => (
              <div key={file.name} className="flex items-center justify-between gap-3 rounded-[18px] bg-[var(--admin-panel-muted)] px-4 py-3">
                <div>
                  <p className="text-sm text-text">{file.name}</p>
                  <p className="text-xs text-unactive-text">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeNewFile(file.name)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ImageFieldManager;
