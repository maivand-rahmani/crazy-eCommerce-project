"use client";
import { Modal, Miniloader } from "@/shared";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import {
  Mail,
  Calendar,
  Clock,
  Fingerprint,
  MapPin,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import { AddUserAddressForm } from "@/entities/user";
import { Fetch } from "@/shared/lib";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

export const UserProfileModal = ({ isOpen, onClose, user }) => {
  const t = useTranslations("account");
  const tAddress = useTranslations("address");
  const tCommon = useTranslations("common");
  const { update: updateSession } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: user?.name || "",
    },
  });

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const res = await Fetch("/api/user/addresses", "GET");
      if (res?.data?.addresses) {
        setAddresses(res.data.addresses);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      reset({ name: user?.name || "" });
      setAddressToEdit(false);
      fetchAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // NOTE: early return stays after all hooks so hook order is stable.
  if (!user) {
    return null;
  }

  const onSubmit = async (data) => {
    const name = (data.name || "").trim();
    if (!name) return;
    setIsSubmitting(true);
    try {
      const res = await Fetch("/api/user/profile", "PATCH", { name });
      if (res?.data) {
        reset({ name: res.data.name });
        // Refresh the NextAuth session so header/avatar update everywhere.
        await updateSession({ name: res.data.name });
        toast.success(tAddress("updated"));
        onClose();
      } else {
        toast.error(res?.error || tCommon("error"));
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(tCommon("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const handleAddressAdded = () => {
    fetchAddresses();
    setIsAddressModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFullAddress = (address) => {
    return [
      address.street,
      address.city,
      address.state,
      address.zip,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const deleteAddress = async (addressId) => {
    try {
      const res = await Fetch(`/api/user/addresses`, "DELETE", {
        id: addressId,
      });
      if (res?.status === 200) {
        toast.success(tAddress("deleteSuccess"));
        fetchAddresses();
      } else {
        toast.error(res?.error || tAddress("deleteFaild"));
      }
    } catch (error) {
      toast.error(tAddress("deleteFaild"));
      console.error("Failed to delete address:", error);
    }
  };

  const editAddress = (address) => {
    setIsAddressModalOpen(true);
    setAddressToEdit(address);
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="space-y-6">
          {/* Header */}
          <div className="p-1 text-center">
            <h2 className="text-2xl font-bold text-text">{t("myProfile")}</h2>
            <p className="mt-1 text-sm text-unactive-text">
              {t("manageAccount")}
            </p>
          </div>

          {/* Profile Card */}
          <div className="rounded-2xl border border-border/60 bg-surface p-6">
            <div className="flex items-center gap-5 space-x-4">
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full shadow-lg ring-4 ring-border/60">
                  <Image
                    src={user?.image || "/icons/profile-circle-svgrepo-com.svg"}
                    alt={user?.name || "User"}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text">
                  {user?.name || "User"}
                </h3>
                <div className="mt-1 flex items-center text-sm text-unactive-text">
                  <Mail className="mr-1.5 h-4 w-4" />
                  {user?.email}
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2 space-y-5 py-2"
          >
            {/* Editable Field */}
            <div className="rounded-xl border border-border/60 bg-surface p-4 transition-colors hover:border-primary/40">
              <label className="mb-2 block text-sm font-semibold text-text">
                {t("displayName")}
              </label>
              <input
                type="text"
                className="inputStyle"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="mt-2 flex items-center text-sm text-danger">
                  <span className="mr-2 h-1 w-1 rounded-full bg-danger"></span>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Read-only Information */}
            <div className="space-y-3">
              <div className="rounded-xl border border-border/60 bg-surface p-4">
                <div className="flex items-start space-x-3">
                  <Mail className="mt-0.5 h-4 w-4 text-unactive-text" />
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-unactive-text">
                      {t("emailAddress")}
                    </p>
                    <p className="mt-1 font-mono text-sm text-text">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-surface p-4">
                <div className="flex items-start space-x-3">
                  <Fingerprint className="mt-0.5 h-4 w-4 text-unactive-text" />
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-unactive-text">
                      {t("userId")}
                    </p>
                    <p className="mt-1 font-mono text-sm text-text">
                      {user?.id}
                    </p>
                  </div>
                </div>
              </div>

              {user.createdAt && (
                <div className="rounded-xl border border-border/60 bg-surface p-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="mt-0.5 h-4 w-4 text-unactive-text" />
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-unactive-text">
                        {t("memberSince")}
                      </p>
                      <p className="mt-1 text-sm text-text">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {user.updatedAt && (
                <div className="rounded-xl border border-border/60 bg-surface p-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="mt-0.5 h-4 w-4 text-unactive-text" />
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase tracking-wider text-unactive-text">
                        {t("lastUpdated")}
                      </p>
                      <p className="mt-1 text-sm text-text">
                        {formatDate(user.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Addresses Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="flex items-center text-sm font-semibold text-text">
                  <MapPin className="mr-2 h-4 w-4" />
                  {t("myAddresses")}
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="flex items-center text-sm font-medium text-primary transition-colors hover:opacity-80"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  {t("addNew")}
                </button>
              </div>

              {loadingAddresses ? (
                <div className="flex items-center justify-center py-4">
                  <Miniloader />
                </div>
              ) : addresses.length > 0 ? (
                <div className="max-h-48 space-y-2 overflow-y-auto">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="group rounded-xl border border-border/60 bg-surface p-4 transition-colors hover:border-primary/40"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-text">
                              {address.street}
                            </p>
                            {address.isDefault && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {tAddress("default")}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-unactive-text">
                            {getFullAddress(address)}
                          </p>
                          {address.phone && (
                            <p className="mt-1 text-sm text-unactive-text">
                              {tAddress("phone")}: {address.phone}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="btn"
                            type="button"
                            onClick={() => deleteAddress(address.id)}
                            aria-label={tAddress("deleteFaild")}
                          >
                            <Trash2 className="h-4 w-4 text-danger" />
                          </button>
                          <button
                            className="btn"
                            type="button"
                            onClick={() => editAddress(address)}
                          >
                            <Edit className="h-4 w-4 text-primary" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-surface py-6 text-center">
                  <MapPin className="mx-auto mb-2 h-8 w-8 text-unactive-text" />
                  <p className="text-sm text-unactive-text">
                    {t("noAddresses")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(true)}
                    className="mt-2 text-sm font-medium text-primary hover:opacity-80"
                  >
                    {t("addFirst")}
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isDirty && (
              <div className="flex gap-3 border-t border-border/60 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl border border-border/60 px-4 py-2.5 font-medium text-text transition-all duration-200 hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {tAddress("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl bg-primary px-4 py-2.5 font-medium text-primary-text transition-all duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Miniloader />
                      {tCommon("saving")}
                    </span>
                  ) : (
                    tCommon("saveChanges")
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </Modal>

      {/* Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      >
        <AddUserAddressForm
          onAddressAdded={handleAddressAdded}
          onCancel={() => setIsAddressModalOpen(false)}
          {...(addressToEdit && { addressForEdit: addressToEdit })}
        />
      </Modal>
    </>
  );
};
