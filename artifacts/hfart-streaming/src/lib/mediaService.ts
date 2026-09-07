import { logger } from './logger';

export interface MediaConstraints {
  video?: boolean | MediaTrackConstraints;
  audio?: boolean | MediaTrackConstraints;
}

export interface StreamConfig {
  videoCodec?: string; // 'vp8' | 'vp9' | 'h264'
  audioCodec?: string; // 'opus' | 'pcm'
  maxBitrate?: number; // kbps
  maxFramerate?: number; // fps
}

// Real camera/mic capture via WebRTC
export class MediaCaptureService {
  private localStream: MediaStream | null = null;
  private peerConnections: Map<string, RTCPeerConnection> = new Map();

  /**
   * Capture real camera and microphone
   */
  async startCapture(constraints: MediaConstraints = { video: true, audio: true }) {
    try {
      // Check browser support
      const getUserMedia = navigator.mediaDevices?.getUserMedia;
      if (!getUserMedia) {
        throw new Error('getUserMedia not supported in this browser');
      }

      // Request permissions and get media stream
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('✅ Camera & Mic captured:', {
        video: this.localStream.getVideoTracks().length > 0,
        audio: this.localStream.getAudioTracks().length > 0,
      });

      return this.localStream;
    } catch (error) {
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          console.error('❌ Camera/Mic permission denied by user');
          throw new Error('Camera/Microphone permission denied');
        } else if (error.name === 'NotFoundError') {
          console.error('❌ No camera/mic device found');
          throw new Error('No camera or microphone device found');
        }
      }
      console.error('❌ Media capture failed:', error);
      throw error;
    }
  }

  /**
   * Stop all media tracks
   */
  stopCapture() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        track.stop();
        console.log(`🛑 Stopped ${track.kind} track`);
      });
      this.localStream = null;
    }
  }

  /**
   * Get current local stream
   */
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  /**
   * Create WebRTC peer connection for streaming
   */
  async createPeerConnection(
    peerConnectionId: string,
    config: StreamConfig = {}
  ): Promise<RTCPeerConnection> {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
        ],
      });

      // Add local media tracks to peer connection
      if (this.localStream) {
        this.localStream.getTracks().forEach((track) => {
          pc.addTrack(track, this.localStream!);
        });
      }

      // Apply bitrate/codec constraints if specified
      if (config.maxBitrate || config.maxFramerate) {
        pc.addEventListener('connectionstatechange', async () => {
          if (pc.connectionState === 'connected') {
            const senders = pc.getSenders();
            for (const sender of senders) {
              const params = sender.getParameters();
              if (!params.encodings) params.encodings = [{}];
              if (config.maxBitrate) {
                params.encodings[0].maxBitrate = config.maxBitrate * 1000; // Convert kbps to bps
              }
              if (config.maxFramerate && sender.track?.kind === 'video') {
                params.encodings[0].maxFramerate = config.maxFramerate;
              }
              try {
                await sender.setParameters(params);
              } catch (e) {
                console.warn('Failed to set encoding params:', e);
              }
            }
          }
        });
      }

      pc.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
          console.log('🧊 ICE candidate:', event.candidate.candidate);
          // Send via signaling server in production
        }
      });

      pc.addEventListener('connectionstatechange', () => {
        console.log(`📡 Connection state: ${pc.connectionState}`);
      });

      this.peerConnections.set(peerConnectionId, pc);
      console.log('✅ Peer connection created:', peerConnectionId);

      return pc;
    } catch (error) {
      console.error('❌ Failed to create peer connection:', error);
      throw error;
    }
  }

  /**
   * Get peer connection by ID
   */
  getPeerConnection(peerConnectionId: string): RTCPeerConnection | undefined {
    return this.peerConnections.get(peerConnectionId);
  }

  /**
   * Close peer connection
   */
  closePeerConnection(peerConnectionId: string) {
    const pc = this.peerConnections.get(peerConnectionId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(peerConnectionId);
      console.log('🛑 Peer connection closed:', peerConnectionId);
    }
  }

  /**
   * Close all connections
   */
  closeAllConnections() {
    this.peerConnections.forEach((pc, id) => {
      pc.close();
      console.log('🛑 Closed peer connection:', id);
    });
    this.peerConnections.clear();
  }

  /**
   * Toggle video track enabled/disabled
   */
  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
      console.log(`📹 Video ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Toggle audio track enabled/disabled
   */
  toggleAudio(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
      console.log(`🎤 Audio ${enabled ? 'enabled' : 'disabled'}`);
    }
  }
}

// Export singleton instance
export const mediaService = new MediaCaptureService();
