export default async function getRequestConfig( params ) {
  const locale = params?.locale || "en";

  const messages = await import(`../json/${locale}.json`);

  return {
    locale,
    messages: messages.default
  };
}
