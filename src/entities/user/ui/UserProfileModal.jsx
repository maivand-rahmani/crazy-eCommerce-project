"use client";
import Modal from "@/shared/ui/modal/Modal";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";


export const UserProfileModal = ({ isOpen, onClose, user }) => {
  // Early return if no user provided
  if (!user) {
    return null;
  }

  const t = useTranslations("userInfo");
  return (
  <Modal isOpen={isOpen} onClose={onClose}>
    <h2 className="text-xl font-bold mb-3">{t("title")}</h2>
    <p>
      <strong>{t("name")}:</strong> {user.name}
    </p>
    <p>
      <strong>{t("email")}:</strong> {user.email}
    </p>
    <button onClick={() => signOut()}>{t("logout")}</button>
  </Modal>)
};

export const UserInfoModal = () => {
    const router = useRouter()
  let [isOpen, setIsOpen] = useState(false);
  const { data } = useSession();
  const user = data?.user;

  function handleProfileClick() {
    if (user) {
      setIsOpen(true);
    } else {
      router.push("/auth");
    }
  }

  return (
    <div>
      <div onClick={handleProfileClick}>
        <button >
            <img
          alt="profile"
          className=" rounded-full"
          width={25}
          height={25}
          src={`${user?.image ? user?.image : "/icons/profile-circle-svgrepo-com.svg"}`}
        />
        </button>
        
      </div>

      {isOpen && (
        <UserProfileModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          user={user}
        />
      )}
    </div>
  );
};
