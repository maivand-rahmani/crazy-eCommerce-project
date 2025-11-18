import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
  const locale = 'en'; // или определить через cookie, заголовок, user prefs

  return {
    locale,
    messages: (await import(`./${locale}.json`)).default
  };
});
