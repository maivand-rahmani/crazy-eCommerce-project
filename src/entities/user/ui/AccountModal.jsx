"use client";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "@/shared/i18n";
import { CreditCard, LogOut, Settings } from "lucide-react";
import { Dropdown } from "@/shared";
import { useTranslations } from "next-intl";

export const UserInfoModal = () => {
  const t = useTranslations("account");
  const router = useRouter();
  const { data } = useSession();
  const user = data?.user;

  function handleMenuAction(key) {
    switch (key) {
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
        aria-label={t("title")}
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:shadow-md"
      >
        <img
          src="/icons/profile-circle-svgrepo-com.svg"
          alt="profile"
          width={26}
          height={26}
          className="h-full w-full rounded-full object-cover opacity-90"
        />
      </button>
    );
  }

  return (
    <Dropdown.Root>
      <Dropdown.DotsButton className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-background/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:bg-card hover:shadow-md">
        <Image
          src={user.image || "/icons/profile-circle-svgrepo-com.svg"}
          alt="profile"
          width={26}
          height={26}
          className="h-full w-full rounded-full object-cover"
        />
      </Dropdown.DotsButton>

      <Dropdown.Popover className="min-w-64 rounded-2xl border border-border/60 bg-card/95 p-1.5 text-text shadow-[0_18px_40px_-24px_rgba(15,23,42,0.28)] backdrop-blur-xl">
        <Dropdown.Menu onAction={handleMenuAction}>
          <Dropdown.Section>
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
              id="logout"
              label={t("logout")}
              icon={LogOut}
              className="rounded-xl text-danger"
            />
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  );
};

export default UserInfoModal;
