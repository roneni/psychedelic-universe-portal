interface YouTubeEmbedProps {
  videoId: string;
  title: string;
}

export function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl group">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div className="absolute inset-0 pointer-events-none border border-primary/20 rounded-xl group-hover:border-primary/50 transition-colors duration-300"></div>
    </div>
  );
}
