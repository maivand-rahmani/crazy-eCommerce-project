"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal, Miniloader } from "@/shared";
import toast from "react-hot-toast";
import { Fetch } from "@/shared/lib";
import { useTranslations } from "next-intl";
import { MapPin, Plus } from "lucide-react";

const addUserAddress = async (data) => {
  return await Fetch("/api/user/addresses", "POST", data);
};

const updateUserAddress = async (id, data) => {
  return await Fetch(`/api/user/addresses`, "PUT", { id, ...data });
};

export const AddUserAddressForm = ({
  setStep = false,
  setOrderInfo = false,
  onAddressAdded,
  onCancel,
  addressForEdit = false,
}) => {
  const t = useTranslations("address");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(addressForEdit);
  const [allAddresses, setAllAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCheckoutMode, setIsCheckoutMode] = useState(
    !!(setStep && setOrderInfo),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    reset,
  } = useForm();

  let fillForm = ({ street, city, isDefault, zip, country, phone, state }) => {
    setValue("street", street);
    setValue("city", city);
    setValue("state", state);
    setValue("zip", zip);
    setValue("country", country);
    setValue("phone", phone);
    setValue("isDefault", isDefault);
  };

  let getAllAddresses = async () => {
    try {
      setLoading(true);
      const response = await Fetch("/api/user/addresses", "GET");
      if (response?.data?.addresses) {
        setAllAddresses(response.data.addresses);
        const defaultAddr = response.data.addresses.find(
          (addr) => addr.isDefault === true,
        );
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  let getDefaultAddress = async () => {
    try {
      setLoading(true);
      const defaultAddress = await Fetch("/api/user/addresses").then((res) =>
        res.data.addresses.find((address) => address.isDefault === true),
      );

      if (defaultAddress) {
        fillForm(defaultAddress);
        setAddress(defaultAddress);
      }
    } catch (error) {
      return new Error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (addressForEdit) {
      fillForm(addressForEdit);
    }

    if (isCheckoutMode) {
      getAllAddresses();
    }
  }, [address, addressForEdit, isCheckoutMode]);

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    fillForm(addr);
    setShowAddForm(false);
  };

  const handleContinueWithSelected = () => {
    if (selectedAddressId) {
      const selectedAddr = allAddresses.find(
        (addr) => addr.id === selectedAddressId,
      );
      if (selectedAddr) {
        setOrderInfo((s) => ({ ...s, address: selectedAddr }));
        setStep(2);
        return;
      }
    }
    setShowAddForm(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (
        address &&
        address.street === data.street &&
        address.city === data.city &&
        address.state === data.state &&
        address.zip === data.zip
      ) {
        if (setStep && setOrderInfo) {
          setOrderInfo((s) => ({ ...s, address: data }));
          setStep(2);
        }
        toast.success(t("errors.allreadyAdded"));
        onAddressAdded && onAddressAdded();
      } else {
        const res = await addUserAddress({ ...data, id: crypto.randomUUID() });

        if (res?.status === 409) {
          setError(
            "isDefault",
            { type: "server", message: t("errors.isDefault") },
            { shouldFocus: true },
          );
          return;
        }

        if (setOrderInfo && setStep) {
          setOrderInfo((s) => ({ ...s, address: data }));
          setStep(2);
        }

        if (res?.status === 200 || res?.status === 201) {
          toast.success(t("success"));
          if (onAddressAdded) {
            onAddressAdded();
          }
        }
      }
    } catch (error) {
      toast.error(t("errors.somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (data) => {
    setLoading(true);
    try {
      const res = await updateUserAddress(addressForEdit.id, data);
      if (res?.status === 200 || res?.status === 201) {
        toast.success(t("updated"));
        if (onAddressAdded) {
          onAddressAdded();
        }
      }
    } catch (error) {
      toast.error(t("errors.somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  };

  let correctAction = (data) => {
    if (addressForEdit) {
      onUpdate(data);
    } else {
      onSubmit(data);
    }
  };

  if (isCheckoutMode && !showAddForm && !addressForEdit) {
    return (
      <div className="flex relative flex-col gap-6">
        {loading && (
          <div className="flex justify-center absolute top-0 left-0 w-full h-full z-10 bg-surface/80">
            <Miniloader />
          </div>
        )}

        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-bold text-text">
            {t("selectAddress") || "Select Shipping Address"}
          </h2>
          <p className="text-unactive-text text-sm">
            {t("selectAddressDescription") ||
              "Choose an existing address or add a new one"}
          </p>
        </div>

        {allAddresses.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="text-text text-sm font-medium">
              {t("yourAddresses") || "Your Addresses"}
            </p>
            {allAddresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => handleSelectAddress(addr)}
                className={`
                  cursor-pointer p-4 rounded-xl border-2 transition-all
                  ${
                    selectedAddressId === addr.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
                    ${selectedAddressId === addr.id ? "border-primary" : "border-border"}
                  `}
                  >
                    {selectedAddressId === addr.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-text font-medium">
                        {addr.street}, {addr.city}
                      </span>
                      {addr.isDefault && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                          {t("default") || "Default"}
                        </span>
                      )}
                    </div>
                    <p className="text-unactive-text text-sm mt-1">
                      {addr.state}, {addr.zip}, {addr.country}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-unactive-text text-center py-4">
            {t("noAddresses") || "No saved addresses"}
          </p>
        )}

        <div
          onClick={() => setShowAddForm(true)}
          className="cursor-pointer p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5 text-primary" />
          <span className="text-text font-medium">
            {t("addNewAddress") || "Add New Address"}
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 p-3 rounded-xl text-center text-text border border-border hover:bg-surface transition"
            >
              {t("cancel")}
            </button>
          )}
          <button
            type="button"
            onClick={handleContinueWithSelected}
            disabled={!selectedAddressId && allAddresses.length > 0}
            className={`
              flex-1 p-3 rounded-xl text-center font-medium transition
              ${
                selectedAddressId || allAddresses.length === 0
                  ? "bg-primary text-primary-text hover:opacity-80"
                  : "bg-muted text-unactive-text cursor-not-allowed"
              }
            `}
          >
            {selectedAddressId
              ? t("continue") || "Continue"
              : t("selectAddress") || "Select an Address"}
          </button>
        </div>
      </div>
    );
  }

  if (isCheckoutMode && showAddForm && !addressForEdit) {
    return (
      <form
        onSubmit={handleSubmit(correctAction)}
        className="flex relative flex-col gap-6"
      >
        {loading && (
          <div className="flex justify-center absolute top-0 left-0 w-full h-full z-10 bg-surface/80">
            <Miniloader />
          </div>
        )}

        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-bold text-text">{t("add")}</h2>
          <p className="text-unactive-text text-sm">{t("addDescription")}</p>
        </div>

        {allAddresses.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setShowAddForm(false);
              reset();
            }}
            className="text-primary text-sm hover:underline flex items-center gap-1"
          >
            ← {t("backToAddresses") || "Back to saved addresses"}
          </button>
        )}

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-text text-sm font-medium">{t("street")}</span>
            <input
              {...register("street", {
                required: t("errors.streetRequired"),
              })}
              className="inputStyle"
              placeholder="123 Main Street"
              type="text"
            />
            {errors.street && (
              <span className="text-danger text-sm">
                {errors.street.message}
              </span>
            )}
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-text text-sm font-medium">{t("city")}</span>
              <input
                {...register("city", { required: t("errors.cityRequired") })}
                className="inputStyle"
                placeholder="New York"
                type="text"
              />
              {errors.city && (
                <span className="text-danger text-sm">
                  {errors.city.message}
                </span>
              )}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-text text-sm font-medium">
                {t("state")}
              </span>
              <input
                {...register("state", { required: t("errors.stateRequired") })}
                className="inputStyle"
                placeholder="NY"
                type="text"
              />
              {errors.state && (
                <span className="text-danger text-sm">
                  {errors.state.message}
                </span>
              )}
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-text text-sm font-medium">{t("zip")}</span>
              <input
                {...register("zip", { required: t("errors.zipRequired") })}
                className="inputStyle"
                placeholder="10001"
                type="text"
              />
              {errors.zip && (
                <span className="text-danger text-sm">
                  {errors.zip.message}
                </span>
              )}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-text text-sm font-medium">
                {t("country")}
              </span>
              <input
                {...register("country", {
                  required: t("errors.countryRequired"),
                })}
                className="inputStyle"
                placeholder="United States"
                type="text"
              />
              {errors.country && (
                <span className="text-danger text-sm">
                  {errors.country.message}
                </span>
              )}
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-text text-sm font-medium">{t("phone")}</span>
            <input
              {...register("phone", { required: t("errors.phoneRequired") })}
              className="inputStyle"
              placeholder="+1 (555) 123-4567"
              type="tel"
            />
            {errors.phone && (
              <span className="text-danger text-sm">
                {errors.phone.message}
              </span>
            )}
          </label>

          <label className="flex items-center gap-2">
            <input
              {...register("isDefault")}
              type="checkbox"
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-text text-sm">{t("setDefault")}</span>
          </label>
          <span>
            {errors.isDefault && (
              <span className="text-danger text-center text-sm">
                {errors.isDefault.message}
              </span>
            )}
          </span>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="flex-1 p-3 rounded-xl text-center text-text border border-border hover:bg-surface transition"
          >
            {t("back") || "Back"}
          </button>
          <button
            type="submit"
            className="flex-1 p-3 rounded-xl text-center text-primary-text bg-primary hover:opacity-80 transition"
          >
            {t("add")}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(correctAction)}
      className="flex relative flex-col gap-6"
    >
      {loading && (
        <div className="flex justify-center absolute top-0 left-0 w-full h-full">
          <Miniloader />
        </div>
      )}
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-bold text-text">
          {address ? t("update") : t("add")}
        </h2>
        <p className="text-unactive-text text-sm">
          {address ? t("updateDescription") : t("addDescription")}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-text text-sm font-medium">{t("street")}</span>
          <input
            {...register("street", {
              required: t("errors.streetRequired"),
            })}
            className="inputStyle"
            placeholder="123 Main Street"
            type="text"
          />
          {errors.street && (
            <span className="text-danger text-sm">{errors.street.message}</span>
          )}
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-text text-sm font-medium">{t("city")}</span>
            <input
              {...register("city", { required: t("errors.cityRequired") })}
              className="inputStyle"
              placeholder="New York"
              type="text"
            />
            {errors.city && (
              <span className="text-danger text-sm">{errors.city.message}</span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-text text-sm font-medium">{t("state")}</span>
            <input
              {...register("state", { required: t("errors.stateRequired") })}
              className="inputStyle"
              placeholder="NY"
              type="text"
            />
            {errors.state && (
              <span className="text-danger text-sm">
                {errors.state.message}
              </span>
            )}
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-text text-sm font-medium">{t("zip")}</span>
            <input
              {...register("zip", { required: t("errors.zipRequired") })}
              className="inputStyle"
              placeholder="10001"
              type="text"
            />
            {errors.zip && (
              <span className="text-danger text-sm">{errors.zip.message}</span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-text text-sm font-medium">
              {t("country")}
            </span>
            <input
              {...register("country", {
                required: t("errors.countryRequired"),
              })}
              className="inputStyle"
              placeholder="United States"
              type="text"
            />
            {errors.country && (
              <span className="text-danger text-sm">
                {errors.country.message}
              </span>
            )}
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-text text-sm font-medium">{t("phone")}</span>
          <input
            {...register("phone", { required: t("errors.phoneRequired") })}
            className="inputStyle"
            placeholder="+1 (555) 123-4567"
            type="tel"
          />
          {errors.phone && (
            <span className="text-danger text-sm">{errors.phone.message}</span>
          )}
        </label>

        <label className="flex items-center gap-2">
          <input
            {...register("isDefault")}
            type="checkbox"
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
          />
          <span className="text-text text-sm">{t("setDefault")}</span>
        </label>
        <span>
          {errors.isDefault && (
            <span className="text-danger text-center text-sm">
              {errors.isDefault.message}
            </span>
          )}
        </span>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 p-3 rounded-xl text-center text-text border border-border hover:bg-surface transition"
        >
          {t("cancel")}
        </button>
        <button
          type="submit"
          className="flex-1 p-3 rounded-xl text-center text-primary-text bg-primary hover:opacity-80 transition"
        >
          {address ? t("confirm") : t("add")}
        </button>
      </div>
    </form>
  );
};

export default AddUserAddressForm;
