import { getSettings } from "@/features/admin-settings/model/settings";

export async function GET() {
  try {
    const settings = await getSettings();
    const publicSettings = {
      storeName: settings["store.name"],
      storeTagline: settings["store.tagline"],
      contactEmail: settings["contact.email"],
      contactPhone: settings["contact.phone"],
      contactAddress: settings["contact.address"],
    };
    return Response.json(publicSettings);
  } catch (e) {
    return Response.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
