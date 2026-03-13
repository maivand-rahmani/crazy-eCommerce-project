import { revalidatePath } from "next/cache";

import { APP_LOCALES, localizePath } from "./paths";

export function revalidateLocalizedPath(path) {
  APP_LOCALES.forEach((locale) => {
    revalidatePath(localizePath(locale, path));
  });
}

export function revalidateLocalizedPaths(paths = []) {
  paths.forEach((path) => revalidateLocalizedPath(path));
}
