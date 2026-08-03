import { useEffect, useRef, useState } from 'react'
import type { ActModule } from '../types/story'
import { StoryControls } from './StoryControls'

const mediaUrl = (file?: string | null) => file ? `/story/${file}` : undefined

export function CinematicActPlayer({ act, onComplete, onPrevious }: { act: ActModule; onComplete: () => void; onPrevious?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasVideo = Boolean(act.media?.video)
  const [playing, setPlaying] = useState(false)
  const [videoAvailable, setVideoAvailable] = useState(hasVideo)

  useEffect(() => {
    const video = videoRef.current
    setVideoAvailable(hasVideo)
    setPlaying(false)
    if (!video || !hasVideo) return

    // Always prefer the soundtrack embedded in the MP4. Unmuted autoplay may be
    // refused by the browser; the Play button then retries from a user gesture.
    video.muted = false
    video.volume = 1
    void video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [act.id, hasVideo])

  const togglePlayback = async () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.muted = false
      video.volume = 1
      await video.play().then(() => setPlaying(true)).catch((error: unknown) => console.warn('Lecture vidéo refusée.', error))
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  const replay = async () => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    video.muted = false
    video.volume = 1
    await video.play().then(() => setPlaying(true)).catch((error: unknown) => console.warn('Relecture vidéo refusée.', error))
  }

  return <article className="screen cinematic">
    <p className="eyebrow">Le vieux marin raconte</p>
    <h2>{act.title}</h2>
    {videoAvailable ? <>
      <video
        ref={videoRef}
        className="act-video"
        src={mediaUrl(act.media?.video)}
        poster={mediaUrl(act.media?.poster)}
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => {
          console.warn(`Vidéo indisponible : ${act.media?.video}`)
          setVideoAvailable(false)
          setPlaying(false)
        }}
      />
      <div className="media-controls" aria-label="Commandes de la vidéo">
        <button className="button" onClick={togglePlayback}>{playing ? 'Pause' : 'Lecture'}</button>
        <button className="button secondary" onClick={replay}>Revisionner</button>
      </div>
    </> : <p className="construction-message">En cours de construction.</p>}
    <StoryControls onNext={onComplete} onPrevious={onPrevious} />
  </article>
}
