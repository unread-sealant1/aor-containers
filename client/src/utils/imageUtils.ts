export const getImageUrl = (url: string | undefined): string => {
  if (!url) return 'https://via.placeholder.com/150?text=No+Image';

  if (url.startsWith('http')) return url;

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiBase.replace(/\/api$/, '');

  const formattedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const formattedPath = url.startsWith('/') ? url.substring(1) : url;

  return `${formattedBase}${formattedPath}`;
};
