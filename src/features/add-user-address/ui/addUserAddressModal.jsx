"use client";
import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import Modal from "@/shared/ui/modal/Modal";
import addUserAddress from "../model/UserAddress";
import toast from "react-hot-toast";
import Fetch from "@/shared/lib/fetch";
import Miniloader from "@/shared/ui/Loading/ComponentLoader/miniloader";

const AddUserAddressForm = ({ setStep = () => {} , setOrderInfo }) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  let defaultAddress = async () => {
    try {
      setLoading(true);
      const addresses = await Fetch("/api/user/addresses").then((res) =>
        res.data.addresses.find((address) => address.isDefault === true),
      );
      if (addresses) {
        setValue("street", addresses.street);
        setValue("city", addresses.city);
        setValue("state", addresses.state);
        setValue("zip", addresses.zip);
        setValue("country", addresses.country);
        setValue("phone", addresses.phone);
        setValue("isDefault", addresses.isDefault);
        setAddress(addresses);
      }
    } catch (error) {
      return new Error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    defaultAddress();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (address) {
        setOrderInfo((s) => ({ ...s, address: data }));
        setStep(2);
      } else {
        const res = await addUserAddress(data);
        setOrderInfo((s) => ({ ...s, address: data }));
        if (res?.status === 200) setStep(2);
        toast.success("Address added successfully");
      } 
    } catch (error) {
      toast.error("Something gone wrong while sending request");
    } finally {
      setLoading(false);
    }
    console.log("Address data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex relative flex-col gap-6">
      {loading && <div className="flex justify-center absolute top-0 left-0 w-full h-full"><Miniloader /></div>}
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-bold text-text">
          {address ? "Update Address" : "Add Address"}
        </h2>
        <p className="text-unactive-text text-sm">
          {address
            ? "Fill in the details below to update your address"
            : "Fill in the details below to add a new address"}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-text text-sm font-medium">Street Address</span>
          <input
            {...register("street", {
              required: "Street address is required",
            })}
            className="inputStyle"
            placeholder="123 Main Street"
            type="text"
          />
          {errors.street && (
            <span className="text-red-500 text-sm">
              {errors.street.message}
            </span>
          )}
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-text text-sm font-medium">City</span>
            <input
              {...register("city", { required: "City is required" })}
              className="inputStyle"
              placeholder="New York"
              type="text"
            />
            {errors.city && (
              <span className="text-red-500 text-sm">
                {errors.city.message}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-text text-sm font-medium">State</span>
            <input
              {...register("state", { required: "State is required" })}
              className="inputStyle"
              placeholder="NY"
              type="text"
            />
            {errors.state && (
              <span className="text-red-500 text-sm">
                {errors.state.message}
              </span>
            )}
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-text text-sm font-medium">ZIP Code</span>
            <input
              {...register("zip", { required: "ZIP code is required" })}
              className="inputStyle"
              placeholder="10001"
              type="text"
            />
            {errors.zip && (
              <span className="text-red-500 text-sm">{errors.zip.message}</span>
            )}
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-text text-sm font-medium">Country</span>
            <input
              {...register("country", { required: "Country is required" })}
              className="inputStyle"
              placeholder="United States"
              type="text"
            />
            {errors.country && (
              <span className="text-red-500 text-sm">
                {errors.country.message}
              </span>
            )}
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-text text-sm font-medium">Phone Number</span>
          <input
            {...register("phone", { required: "Phone number is required" })}
            className="inputStyle"
            placeholder="+1 (555) 123-4567"
            type="tel"
          />
          {errors.phone && (
            <span className="text-red-500 text-sm">{errors.phone.message}</span>
          )}
        </label>

        <label className="flex items-center gap-2">
          <input
            {...register("isDefault")}
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <span className="text-text text-sm">Set as default address</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          className="flex-1 p-3 rounded-xl text-center text-text border border-gray-300 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 p-3 rounded-xl text-center text-white bg-black hover:bg-gray-800 transition"
        >
          {address ? "confirm" : "Add Address"}
        </button>
      </div>
    </form>
  );
};

export default AddUserAddressForm;
