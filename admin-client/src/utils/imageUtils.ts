export const getImageUrl = (url: string | undefined): string => {
  if (!url) return 'https://via.placeholder.com/150?text=No+Image';

  // If it's already a full URL, return it
  if (url.startsWith('http')) return url;

  // Use the API base URL but remove the '/api' suffix
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiBase.replace(/\/api$/, '');

  // Ensure there's a slash between base and path
  const formattedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const formattedPath = url.startsWith('/') ? url.substring(1) : url;

  return `${formattedBase}${formattedPath}`;
};
