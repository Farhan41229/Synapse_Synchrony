import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '@/lib/token';

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  StreamTheme,
  CallingState,
  useCallStateHooks,
  useCall,
} from '@stream-io/video-react-sdk';

import '@stream-io/video-react-sdk/dist/css/styles.css';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/spinner';
import { Mic, MicOff } from 'lucide-react';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

let globalAudioClient = null;
let globalAudioUserId = null;

const AudioCallPage = () => {
  const { callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const hasJoinedRef = useRef(false);

  const { user } = useAuthStore();

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!user,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !user || !callId) return;
      if (hasJoinedRef.current) return;

      try {
        hasJoinedRef.current = true;

        let audioClient;

        if (globalAudioClient && globalAudioUserId === user._id) {
          audioClient = globalAudioClient;
        } else {
          if (globalAudioClient) {
            try {
              await globalAudioClient.disconnectUser();
            } catch (_e) { }
          }

          const streamUser = {
            id: user._id,
            name: user.name,
            image: user.avatar,
          };

          audioClient = new StreamVideoClient({
            apiKey: STREAM_API_KEY,
            user: streamUser,
            token: tokenData.token,
          });

          globalAudioClient = audioClient;
          globalAudioUserId = user._id;
        }

        const callInstance = audioClient.call('default', callId);

        await callInstance.join({ create: true });

        // Disable camera for audio-only calls
        await callInstance.camera.disable();

        setClient(audioClient);
        setCall(callInstance);
      } catch (error) {
        toast.error('Could not join the audio call. Please try again.');
        hasJoinedRef.current = false;
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    return () => {
      if (call) {
        call.leave().catch(() => { });
      }
      hasJoinedRef.current = false;
    };
  }, [tokenData, user, callId]);

  // Inject Stream control bar styles
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      .str-video__call-controls {
        position: fixed !important;
        bottom: 20px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        z-index: 9999 !important;
        display: flex !important;
        gap: 12px !important;
        padding: 16px !important;
        background: rgba(0, 0, 0, 0.7) !important;
        border-radius: 12px !important;
      }

      .str-video__call-controls button {
        all: revert !important;
        width: 48px !important;
        height: 48px !important;
        min-width: 48px !important;
        min-height: 48px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: rgba(255, 255, 255, 0.1) !important;
        border: none !important;
        cursor: pointer !important;
        transition: all 0.2s !important;
      }

      .str-video__call-controls button:hover {
        background: rgba(255, 255, 255, 0.2) !important;
      }

      .str-video__call-controls button svg {
        width: 24px !important;
        height: 24px !important;
        fill: white !important;
        stroke: white !important;
      }
    `;

    document.head.appendChild(styleEl);

    return () => {
      if (document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);

  if (isConnecting) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <Spinner className="w-12 h-12 mx-auto mb-4 text-white" />
          <p style={{ color: 'white', fontSize: '18px', fontWeight: '500' }}>
            Connecting to audio call...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <AudioCallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <p style={{ color: 'white' }}>
              Could not initialize audio call. Please refresh or try again
              later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const AudioCallContent = () => {
  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();
  const call = useCall();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) {
    navigate('/dashboard/chat');
    return null;
  }

  return (
    <StreamTheme>
      {/* Audio call UI */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '40px',
        }}
      >
        {/* Participant avatars */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            marginBottom: '60px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {participants.map((participant) => (
            <ParticipantCard
              key={participant.sessionId}
              participant={participant}
              call={call}
            />
          ))}
        </div>

        {/* Call info bar */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '16px 24px',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          }}
        >
          <p
            style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              margin: 0,
            }}
          >
            🎙️ Audio Call • {participants.length} participant
            {participants.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Call controls */}
      <CallControls />
    </StreamTheme>
  );
};

// Individual participant card with mic status
const ParticipantCard = ({ participant, call }) => {
  const [hasAudio, setHasAudio] = useState(false);

  useEffect(() => {
    if (participant.isLocalParticipant && call) {
      const checkLocalAudio = () => {
        const micEnabled = call.microphone?.state?.status === 'enabled';
        setHasAudio(micEnabled);
      };

      checkLocalAudio();

      const subscription = call.microphone?.state?.status$?.subscribe(() => {
        checkLocalAudio();
      });

      const interval = setInterval(checkLocalAudio, 200);

      return () => {
        subscription?.unsubscribe?.();
        clearInterval(interval);
      };
    } else {
      const audioEnabled =
        participant.publishedTracks?.includes('audio') ?? false;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasAudio(audioEnabled);
    }
  }, [participant, call]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Avatar with speaking indicator */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: participant.image
              ? `url(${participant.image})`
              : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            fontWeight: '600',
            color: 'white',
            boxShadow: hasAudio
              ? '0 0 0 4px rgba(34, 197, 94, 0.5)'
              : '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '4px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
          }}
        >
          {!participant.image && participant.name?.charAt(0)?.toUpperCase()}
        </div>

        {/* Microphone status icon */}
        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            right: '-8px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: hasAudio ? '#22c55e' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          {hasAudio ? (
            <Mic size={20} style={{ color: 'white' }} />
          ) : (
            <MicOff size={20} style={{ color: 'white' }} />
          )}
        </div>
      </div>

      {/* Name */}
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '600',
            margin: 0,
          }}
        >
          {participant.name || 'Unknown'}
        </p>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            margin: '4px 0 0 0',
          }}
        >
          {participant.isLocalParticipant ? '(You)' : ''}
        </p>
      </div>

      {/* Audio status badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: hasAudio
            ? 'rgba(34, 197, 94, 0.2)'
            : 'rgba(239, 68, 68, 0.2)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${hasAudio ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
            }`,
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          {hasAudio ? '🎤 Active' : '🔇 Muted'}
        </span>
      </div>
    </div>
  );
};

export default AudioCallPage;
