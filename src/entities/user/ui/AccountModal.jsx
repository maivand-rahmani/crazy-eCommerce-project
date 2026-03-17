"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "@/shared/i18n";
import { useState } from "react";
import { UserProfileModal } from "@/entities/user";
import { Dropdown } from "@/shared";
import { CreditCard, LogOut, Settings, User } from "lucide-react";
import { LangSwitcher } from "@/shared/i18n";
import { useTranslations } from "next-intl";

export const UserInfoModal = () => {
  const t = useTranslations("account");
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user;
  const [modal, setModal] = useState(false);

  function handleMenuAction(key) {
    switch (key) {
      case "profile":
        setModal("profile");
        break;
      case "orders":
        router.push("/orders");
        break;
      case "settings":
        router.push("/settings");
        break;
      case "logout":
        signOut();
        break;
    }
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push("/auth")}
        className="overflow-hidden rounded-full border border-border/60 bg-background/80 p-1.5 shadow-sm transition-all duration-200 hover:border-border hover:bg-card hover:shadow-md"
      >
        <img
          src="/icons/profile-circle-svgrepo-com.svg"
          alt="profile"
          width={25}
          height={25}
          className="rounded-full opacity-90"
        />
      </button>
    );
  }

  return (
    <>
      <Dropdown.Root>
        <Dropdown.DotsButton className="overflow-hidden rounded-full border border-border/60 bg-background/80 p-1.5 shadow-sm transition-all duration-200 hover:border-border hover:bg-card hover:shadow-md">
          <Image
            src={user.image || "/icons/profile-circle-svgrepo-com.svg"}
            alt="profile"
            width={25}
            height={25}
            className="rounded-full object-cover"
          />
        </Dropdown.DotsButton>

        <Dropdown.Popover className="min-w-64 rounded-2xl border border-border/60 bg-card/95 p-1.5 text-text shadow-[0_18px_40px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl">
          <Dropdown.Menu onAction={handleMenuAction}>
            <Dropdown.Section>
              <Dropdown.Item
                id="profile"
                label={t("profile")}
                icon={User}
                className="rounded-xl text-text"
              />
              <Dropdown.Item
                id="orders"
                label={t("orders")}
                icon={CreditCard}
                className="rounded-xl text-text"
              />
              <Dropdown.Item
                id="settings"
                label={t("settings")}
                icon={Settings}
                className="rounded-xl text-text"
              />

              <Dropdown.Separator />
              <Dropdown.Item
                label={<LangSwitcher />}
                className="rounded-xl text-text"
              />
              <Dropdown.Separator />

              <Dropdown.Item
                id="logout"
                label={t("logout")}
                icon={LogOut}
                className="rounded-xl text-danger"
              />
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.Root>

      {modal === "profile" && (
        <UserProfileModal
          user={user}
          isOpen={modal}
          onClose={() => setModal(false)}
        />
      )}
    </>
  );
};

export default UserInfoModal;
