export const getYoutubeEmbedUrl = (url: string): string | null => {
  const match = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  if (!match) return null;
  return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&playsinline=1`;
};
