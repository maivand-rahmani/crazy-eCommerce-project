"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button, Input } from "@/shared";

const createRow = () => ({ id: crypto.randomUUID(), key: "", value: "" });

const KeyValueRowsEditor = ({ label, value, onChange, keyPlaceholder, valuePlaceholder }) => {
  const rows = value && value.length > 0 ? value : [createRow()];

  const updateRow = (id, field, nextValue) => {
    onChange(
      rows.map((row) => (row.id === id ? { ...row, [field]: nextValue } : row)),
    );
  };

  const addRow = () => {
    onChange([...rows, createRow()]);
  };

  const removeRow = (id) => {
    const nextRows = rows.filter((row) => row.id !== id);
    onChange(nextRows.length ? nextRows : [createRow()]);
  };

  return (
    <div className="space-y-4 rounded-[26px] border border-border/65 bg-white/34 p-5 shadow-[0_18px_38px_-30px_rgba(15,23,42,0.28)] dark:bg-white/[0.02]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text">{label}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-unactive-text">
            Add structured key-value pairs with clear spacing.
          </p>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={addRow}>
          <Plus className="h-4 w-4" />
          Add row
        </Button>
      </div>
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.id} className="grid gap-3 rounded-[22px] border border-border/60 bg-[var(--admin-panel-muted)]/64 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-unactive-text">Label</span>
              <Input
                value={row.key}
                placeholder={keyPlaceholder}
                onChange={(event) => updateRow(row.id, "key", event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-unactive-text">Value</span>
              <Input
                value={row.value}
                placeholder={valuePlaceholder}
                onChange={(event) => updateRow(row.id, "value", event.target.value)}
              />
            </label>
            <Button type="button" variant="outline" size="sm" onClick={() => removeRow(row.id)}>
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyValueRowsEditor;
