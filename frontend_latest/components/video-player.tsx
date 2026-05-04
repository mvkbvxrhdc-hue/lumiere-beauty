"use client"

import { useState } from "react"
import { PlayCircle, AlertCircle } from "lucide-react"

interface VideoPlayerProps {
  url: string
  title: string
}

export function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const getYouTubeId = (url: string) => {
    if (!url) return null
    const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^#&?/]+)/]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    return null
  }

  const videoId = getYouTubeId(url)
  const isDirectVideo = !videoId && url // Assume it's a direct link if not YouTube

  if (!videoId && !isDirectVideo) {
    return (
      <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <p className="text-white font-medium text-center">Invalid video URL</p>
        <p className="text-gray-400 text-sm text-center mt-2">Please check the video link format</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-12 w-12 text-yellow-400 mb-4" />
        <p className="text-white font-medium text-center">Video failed to load</p>
        <p className="text-gray-400 text-sm text-center mt-2">The video may be unavailable or restricted</p>
        {videoId && (
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Watch on YouTube
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-900 shadow-xl">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="flex flex-col items-center gap-3">
            <PlayCircle className="h-16 w-16 text-white animate-pulse" />
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {videoId ? (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false)
            setError(true)
          }}
        />
      ) : (
        <video
          controls
          className="w-full h-full object-contain"
          onLoadedData={() => setLoading(false)}
          onError={() => {
            setLoading(false)
            setError(true)
          }}
        >
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  )
}
