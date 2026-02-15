"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useLocalizedPath } from "@/shared/hooks/useLocalizedPath";
import { useRouter } from "@/shared/i18n/model/routing";
import { useState } from "react";
import { UserProfileModal } from "@/entities/user/ui/modals/UserProfileModal";
import { Dropdown } from "@/shared/ui/dropdown/dropdown";
import { CreditCard, LogOut, Settings, User } from "lucide-react";
import LangSwitcher from "@/shared/i18n/ui/Switcher";
import { useTranslations } from "next-intl";

export const UserInfoModal = () => {
  const t = useTranslations("account");
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user;
  const [modal , setModal] = useState(false)

  function handleMenuAction(key) {
    switch (key) {
      case "profile":
        setModal("profile")
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
        className="rounded-full overflow-hidden"
      >
        <img
          src="/icons/profile-circle-svgrepo-com.svg"
          alt="profile"
          width={25}
          height={25}
        />
      </button>
    );
  }

   
  return (
    <>
      <Dropdown.Root>
        <Dropdown.DotsButton className="rounded-full overflow-hidden">
          <img
            src={user.image || "/icons/profile-circle-svgrepo-com.svg"}
            alt="profile"
            width={25}
            height={25}
          />
        </Dropdown.DotsButton>

        <Dropdown.Popover className="bg-bg text-text"> 
          <Dropdown.Menu onAction={handleMenuAction}>
            <Dropdown.Section>
              <Dropdown.Item id="profile" label={t("profile")} icon={User} />
              <Dropdown.Item id="orders" label={t("orders")} icon={CreditCard} />
              <Dropdown.Item id="settings" label={t("settings")} icon={Settings} />


              <Dropdown.Separator />
                <Dropdown.Item label={<LangSwitcher />} />
              <Dropdown.Separator />

              <Dropdown.Item
                id="logout"
                label={t("logout")}
                icon={LogOut}
                className="text-red-700"
              />
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown.Root>

      {modal === "profile" && <UserProfileModal user={user} isOpen={modal} onClose={() => setModal(false)} /> }
    </>
    
  );
};
