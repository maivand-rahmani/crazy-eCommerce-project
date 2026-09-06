"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Fetch } from "@/shared/lib/fetch";
import { Miniloader, Modal } from "@/shared";
import { AddUserAddressForm } from "@/entities/user";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AddressesSection() {
  const t = useTranslations("settings.addresses");
  const tAddr = useTranslations("address");
  const tCommon = useTranslations("common");
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | "add" | address object for edit
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await Fetch("/api/user/addresses", "GET");
      setAddresses(res?.data?.addresses ?? []);
    } catch (error) {
      console.error("Failed to load addresses:", error);
      toast.error(t("loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      const res = await Fetch("/api/user/addresses", "DELETE", { id });
      if (res?.status === 200) {
        toast.success(tAddr("deleteSuccess"));
        await load();
      } else {
        toast.error(tAddr("deleteFaild"));
      }
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error(tAddr("deleteFaild"));
    } finally {
      setBusyId(null);
    }
  };

  const handleSetDefault = async (target) => {
    setBusyId(target.id);
    try {
      // API allows only one default: unset the current one first.
      const current = addresses.find((a) => a.isDefault);
      if (current && current.id !== target.id) {
        await Fetch("/api/user/addresses", "PUT", {
          ...current,
          isDefault: false,
        });
      }
      const res = await Fetch("/api/user/addresses", "PUT", {
        ...target,
        isDefault: true,
      });
      if (res?.status === 200 || res?.status === 201) {
        toast.success(tAddr("updated"));
        await load();
      } else {
        toast.error(tAddr("errors.isDefault"));
      }
    } catch (error) {
      console.error("Failed to set default address:", error);
      toast.error(tCommon("error"));
    } finally {
      setBusyId(null);
    }
  };

  const handleFormDone = async () => {
    setModal(null);
    setLoading(true);
    await load();
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">{t("title")}</h2>
          <p className="mt-0.5 text-sm text-unactive-text">
            {t("description")}
          </p>
        </div>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-text transition hover:opacity-80"
        >
          <Plus className="h-4 w-4" />
          {t("addNew")}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Miniloader />
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border py-12 text-center">
          <MapPin className="h-8 w-8 text-unactive-text" />
          <p className="text-sm text-unactive-text">{t("empty")}</p>
          <button
            onClick={() => setModal("add")}
            className="mt-1 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-text transition hover:bg-surface"
          >
            {t("addFirst")}
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {addresses.map((addr) => (
            <li
              key={addr.id}
              className="rounded-xl border border-border/60 p-4 transition hover:border-primary/40"
            >
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-text">
                      {addr.street}, {addr.city}
                    </span>
                    {addr.isDefault && (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                        {tAddr("default")}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-unactive-text">
                    {[addr.state, addr.zip, addr.country]
                      .filter(Boolean)
                      .join(", ")}
                    {addr.phone ? ` · ${addr.phone}` : ""}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 border-t border-border/60 pt-3">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr)}
                    disabled={busyId === addr.id}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text transition hover:bg-surface disabled:opacity-50"
                  >
                    <Star className="h-3.5 w-3.5" />
                    {t("setDefault")}
                  </button>
                )}
                <button
                  onClick={() => setModal(addr)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-text transition hover:bg-surface"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {t("edit")}
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  disabled={busyId === addr.id}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger/10 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t("delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modal && (
        <Modal isOpen={!!modal} onClose={() => setModal(null)}>
          <AddUserAddressForm
            addressForEdit={modal === "add" ? false : modal}
            onAddressAdded={handleFormDone}
            onCancel={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
