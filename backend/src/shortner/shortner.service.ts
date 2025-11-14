export const getShortUrl = async (originalUrl: string) => {
  const response = await fetch(process.env.SHORTNER_API_URL as string, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      url: originalUrl,
    }),
  });

  const { short_url } = await response.json();

  return short_url;
};
