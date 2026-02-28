"use client";
import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import Modal from "@/shared/ui/modal/Modal";
import { addUserAddress  , updateUserAddress} from "../model/UserAddress";
import toast from "react-hot-toast";
import Fetch from "@/shared/lib/fetch";
import Miniloader from "@/shared/ui/Loading/ComponentLoader/miniloader";
import { useTranslations } from "next-intl";

const AddUserAddressForm = ({ setStep = () => {} , setOrderInfo = () => {}, onAddressAdded, onCancel , addressForEdit = false }) => {
  const t = useTranslations("address");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(addressForEdit);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError
  } = useForm();

  let fillForm = ({ street , city , isDefault , zip , country , phone , state }) => {
      setValue("street", street);
      setValue("city",  city);
      setValue("state",  state);
      setValue("zip", zip);
      setValue("country", country);
      setValue("phone", phone);
      setValue("isDefault", isDefault);
  }

  let getDefaultAddress = async () => {
    try {
      setLoading(true);
      const defaultAddress = await Fetch("/api/user/addresses").then((res) =>
        res.data.addresses.find((address) => address.isDefault === true),
      );

      if (defaultAddress) {
        fillForm(defaultAddress)
        setAddress(defaultAddress);
      }
    } catch (error) {
      return new Error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!address) {
      getDefaultAddress();
    }
    if (addressForEdit) {
      fillForm(addressForEdit)
    }
  }, [address , addressForEdit]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (address && address.street === data.street && address.city === data.city && address.state === data.state && address.zip === data.zip) {
        if ( setStep && setOrderInfo) {
          // If we are in the checkout flow, we just set the order info and move to the next step
          setOrderInfo((s) => ({ ...s, address: data }));
          setStep(2);
        }
        toast.success(t("errors.allreadyAdded"));
        onAddressAdded && onAddressAdded();
      } else {
        const res = await addUserAddress({ ...data , id: crypto.randomUUID()});

        if (res?.status === 409) {
          setError("isDefault", { type: "server" ,message: t("errors.isDefault") } , { shouldFocus: true }); 
          return;
        }

        if (setOrderInfo && setStep) {
          // If we are in the checkout flow, we just set the order info but we don't move to the next step because the user might want to add another address
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
      const res = await updateUserAddress(addressForEdit.id , data);
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
  } 

  let correctAction = (data) => {
    if (addressForEdit) {
      onUpdate(data);
    } else {
      onSubmit(data);
    }
  }

  return (
    <form onSubmit={handleSubmit(correctAction)} className="flex relative flex-col gap-6">
      {loading && <div className="flex justify-center absolute top-0 left-0 w-full h-full"><Miniloader /></div>}
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-bold text-text">
          {address ? t("update") : t("add")}
        </h2>
        <p className="text-unactive-text text-sm">
          {address
            ? t("updateDescription")
            : t("addDescription")}
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
            <span className="text-text text-sm font-medium">{t("country")}</span>
            <input
              {...register("country", { required: t("errors.countryRequired") })}
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
          <span>{ errors.isDefault && <span className="text-danger text-center text-sm">{errors.isDefault.message}</span>}</span>
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
