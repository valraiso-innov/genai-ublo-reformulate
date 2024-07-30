const URL_MSEM = process.env.NEXT_PUBLIC_MSEM_API_URL;

export const login = async (token: string) => {
  const resp = await fetch(`${URL_MSEM}/api/esfplus/login`, {
    method: "POST",
    headers: { authorization: token },
  });
  return resp.ok;
};
