export const APP_LOCALES = ["en", "ru", "fa"];

export function localizePath(locale, path) {
  const normalizedPath = path === "/" ? "" : path;
  return `/${locale}${normalizedPath}`;
}
