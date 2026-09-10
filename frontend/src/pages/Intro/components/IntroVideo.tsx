import React, { useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { config } from '../../../lib/config';

interface IntroVideoProps {
  onEnded: () => void;
  autoPlay?: boolean;
}

export const IntroVideo: React.FC<IntroVideoProps> = ({ onEnded, autoPlay = true }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => setHasError(true));
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  // Fallback simulator for preview if real video is not yet provided in /public/videos/
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (hasError && isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setIsPlaying(false);
            onEnded();
            return 100;
          }
          return prev + 5;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [hasError, isPlaying, onEnded]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '380px',
        borderRadius: '24px',
        overflow: 'hidden',
        backgroundColor: '#0F172A',
        boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.25)',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {!hasError ? (
        <video
          ref={videoRef}
          src={config.introVideoPath}
          autoPlay={autoPlay}
          playsInline
          muted
          onEnded={onEnded}
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : null}

      {/* Fallback & Interactive Video Overlay */}
      {(hasError || isLoading) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              border: '2px solid #6366F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
              color: '#818CF8',
            }}
          >
            <Sparkles size={32} />
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', color: '#FFFFFF' }}>
            Welcome to GRIT SCHOOL
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#94A3B8', maxWidth: '320px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            {hasError
              ? 'Intro Video Preview — Place your grit-school-intro.mp4 inside frontend/public/videos/ to load customized video footage.'
              : 'Loading video playback...'}
          </p>

          {/* Fallback simulated play button */}
          <button
            type="button"
            onClick={handlePlayPause}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              backgroundColor: '#6366F1',
              color: '#FFFFFF',
              padding: '0.75rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              cursor: 'pointer',
              border: 'none',
            }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            <span>{isPlaying ? 'Pause Intro' : 'Play Intro Video'}</span>
          </button>
        </div>
      )}

      {/* Bottom Video Progress Bar & Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem 1.25rem',
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, transparent 100%)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={handlePlayPause}
          style={{ color: '#FFFFFF', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        {/* Progress track */}
        <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '2px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: '#6366F1',
              transition: 'width 0.2s linear',
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => {
            if (videoRef.current) videoRef.current.currentTime = 0;
            setProgress(0);
          }}
          style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};
