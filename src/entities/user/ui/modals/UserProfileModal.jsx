"use client";
import { Modal, Miniloader } from "@/shared";
import { useState, useEffect } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(false);

  if (!user) {
    return null;
  }

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
      const res = await Fetch("/api/user/addresses");
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
      fetchAddresses();
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      reset(data);
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
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
      }
    } catch (error) {
      toast.error(tAddress("deleteFailed"));
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
        <div className="space-y-6 ">
          {/* Header */}
          <div className="text-center p-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t("myProfile")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{t("manageAccount")}</p>
          </div>

          {/* Profile Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center space-x-4 gap-5">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                  <Image
                    src={user?.image || "/icons/profile-circle-svgrepo-com.svg"}
                    alt={user?.name || "User"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="96px"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {user?.name || "User"}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Mail className="w-4 h-4 mr-1.5" />
                  {user?.email}
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 flex flex-col py-2 gap-2"
          >
            {/* Editable Field */}
            <div className="bg-surface rounded-lg border border-border p-4 hover:border-primary transition-colors">
              <label className="block text-sm font-semibold text-text mb-2">
                {t("displayName")}
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-surface hover:bg-surface"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-danger flex items-center">
                  <span className="w-1 h-1 bg-danger rounded-full mr-2"></span>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Read-only Information */}
            <div className="space-y-3">
              <div className="bg-surface rounded-lg p-4 border border-border">
                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-unactive-text mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-unactive-text uppercase tracking-wider">
                      {t("emailAddress")}
                    </p>
                    <p className="text-sm text-text font-mono mt-1">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-lg p-4 border border-border">
                <div className="flex items-start space-x-3">
                  <Fingerprint className="w-4 h-4 text-unactive-text mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-unactive-text uppercase tracking-wider">
                      {t("userId")}
                    </p>
                    <p className="text-sm text-text font-mono mt-1">
                      {user?.id}
                    </p>
                  </div>
                </div>
              </div>

              {user.createdAt && (
                <div className="bg-surface rounded-lg p-4 border border-border">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-4 h-4 text-unactive-text mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-unactive-text uppercase tracking-wider">
                        {t("memberSince")}
                      </p>
                      <p className="text-sm text-text mt-1">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {user.updatedAt && (
                <div className="bg-surface rounded-lg p-4 border border-border">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-4 h-4 text-unactive-text mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-unactive-text uppercase tracking-wider">
                        {t("lastUpdated")}
                      </p>
                      <p className="text-sm text-text mt-1">
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
                <p className="text-sm font-semibold text-text flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {t("myAddresses")}
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="text-sm text-primary hover:opacity-80 flex items-center font-medium transition-colors"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {t("addNew")}
                </button>
              </div>

              {loadingAddresses ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : addresses.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {addresses.map((address, index) => (
                    <div
                      key={index}
                      className="bg-surface rounded-lg p-4 border border-border hover:border-primary transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-text">
                              {address.street}
                            </p>
                            {address.isDefault && (
                              <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full font-medium">
                                {tAddress("default")}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-unactive-text mt-1">
                            {address.city}, {address.state} {address.zip}
                          </p>
                          <p className="text-sm text-unactive-text">
                            {address.country}
                          </p>
                          {address.phone && (
                            <p className="text-sm text-unactive-text mt-1">
                              {tAddress("phone")}: {address.phone}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="btn"
                            type="button"
                            onClick={() => deleteAddress(address.id)}
                          >
                            <Trash2 className="w-4 h-4 text-danger" />
                          </button>
                          <button
                            className="btn"
                            type="button"
                            onClick={() => editAddress(address)}
                          >
                            <Edit className="w-4 h-4 text-primary" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-surface rounded-lg border border-dashed border-border">
                  <MapPin className="w-8 h-8 text-unactive-text mx-auto mb-2" />
                  <p className="text-sm text-unactive-text">
                    {t("noAddresses")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(true)}
                    className="mt-2 text-sm text-primary hover:opacity-80 font-medium"
                  >
                    {t("addFirst")}
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isDirty && (
              <div className="flex gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 border border-border text-text rounded-lg hover:bg-surface transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {tAddress("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-primary text-primary-text rounded-lg hover:opacity-80 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("saving")}
                    </span>
                  ) : (
                    t("saveChanges")
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
