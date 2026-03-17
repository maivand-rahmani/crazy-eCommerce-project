import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !['en', 'ru', 'fa'].includes(locale)) {
    locale = 'en';
  }

  const messages = await import(`../json/${locale}.json`);

  return {
    locale,
    messages: messages.default
  };
});
