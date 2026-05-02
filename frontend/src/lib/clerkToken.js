let clerkTokenGetter = null;

export function setClerkTokenGetter(getToken) {
  clerkTokenGetter = getToken;
}

export async function getClerkToken() {
  if (!clerkTokenGetter) return null;
  return clerkTokenGetter();
}
