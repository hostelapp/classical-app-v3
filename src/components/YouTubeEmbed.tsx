const YouTubeEmbed = ({ youtubeId, title }: { youtubeId: string; title: string }) => (
  <iframe
    className="h-full w-full"
    src={`https://www.youtube.com/embed/${youtubeId}`}
    title={title}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
);

export default YouTubeEmbed;
