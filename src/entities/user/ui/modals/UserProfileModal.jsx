"use client";
import Modal from "@/shared/ui/modal/Modal";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

export const UserProfileModal = ({ isOpen, onClose, user }) => {
  const {
    register,
    getValues,
    control,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });
  const values = useWatch({
    control,
    defaultValue: {
      name: user.name,
      email: user.email,
    },
  });

  console.log(values);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-3">My profile</h2>
      <div className="grid grid-cols-[1fr_2fr] gap-3">
        <div>
          <img
            src={user.image || "/icons/profile-circle-svgrepo-com.svg"}
            width={"full"}
            height={"full"}
            className=""
            alt=""
          />
        </div>
        <div>
          <form className="flex flex-col gap-2">
            <label>
              Username
              <input
                type="text"
                className="p-2 inputStyle"
                {...register("name")}
              />
            </label>
            <label>
              Email
              <input
                type="text"
                className="p-2 inputStyle"
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email",
                  },
                })}
              />
              {errors.email && (
                <div className="text-red-800">{errors.email.message}</div>
              )}
            </label>
            <div className="flex gap-2">
              {isDirty && (
                <>
                  <button className="btn bg-gray-400 rounded-full p-2">
                    cancel
                  </button>
                  <button className="btn bg-blue-500 rounded-full p-2">
                    save changes
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
