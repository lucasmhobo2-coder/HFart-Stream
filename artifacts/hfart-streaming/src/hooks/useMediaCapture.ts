import { useEffect, useRef, useState } from 'react';
import { mediaService } from '../lib/mediaService';

export interface UseCaptureOptions {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
  autoStart?: boolean;
}

export function useMediaCapture(options: UseCaptureOptions = {}) {
  const { video = true, audio = true, autoStart = false } = options;
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCapture = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stream = await mediaService.startCapture({ video, audio });
      setLocalStream(stream);

      // Display in video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true; // Mute local preview to avoid echo
      }

      return stream;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start capture');
      setError(error);
      console.error('❌ Capture failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const stopCapture = () => {
    mediaService.stopCapture();
    setLocalStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleVideo = (enabled: boolean) => {
    mediaService.toggleVideo(enabled);
  };

  const toggleAudio = (enabled: boolean) => {
    mediaService.toggleAudio(enabled);
  };

  useEffect(() => {
    if (autoStart) {
      startCapture().catch((err) => console.error(err));
    }

    return () => {
      stopCapture();
    };
  }, [autoStart]);

  return {
    localStream,
    videoRef,
    error,
    isLoading,
    startCapture,
    stopCapture,
    toggleVideo,
    toggleAudio,
  };
}
