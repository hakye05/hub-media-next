export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const usernameRegex = (max: number) => new RegExp(`^[a-z0-9_.]{3,${max}}$`);

export const usernameMessage = (max: number) => `Use 3–${max} letters, numbers, _ or .`;

export const sanitizeUsername = (value: string, max: number) =>
  value.toLowerCase().replace(/[^a-z0-9_.]/g, "").slice(0, max);