"use client";

import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  User, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff,
  Settings,
  Maximize,
  Minimize
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import React, { useRef, useState, useEffect } from 'react'
import { toast } from 'sonner';

const VideoCall = ({ sessionId, token }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoading, setScriptLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState('good');
  const [participantCount, setParticipantCount] = useState(0);
  const [callDuration, setCallDuration] = useState(0);

  const sessionRef = useRef(null);
  const publisherRef = useRef(null);
  const callStartTime = useRef(null);
  const durationInterval = useRef(null);

  const appId = process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID;
  const router = useRouter();

  // Format call duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start call duration timer
  const startDurationTimer = () => {
    callStartTime.current = Date.now();
    durationInterval.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - callStartTime.current) / 1000);
      setCallDuration(elapsed);
    }, 1000);
  };

  // Stop call duration timer
  const stopDurationTimer = () => {
    if (durationInterval.current) {
      clearInterval(durationInterval.current);
      durationInterval.current = null;
    }
  };

  const handleScriptLoaded = () => {
    setScriptLoaded(true);

    if (!window.OT) {
      toast.error("Failed to load Vonage Video API");
      setIsLoading(false);
      return;
    }

    initialiseSession();
  };

  const initialiseSession = () => {
    if (!appId || !sessionId || !token) {
      toast.error("Missing required video call parameters");
      router.push("/appointments");
      return;
    }

    try {
      // Initialize the session
      sessionRef.current = window.OT.initSession(appId, sessionId);

      // Subscribe to new streams
      sessionRef.current.on("streamCreated", (event) => {
        console.log("New stream created");
        setParticipantCount(prev => prev + 1);

        sessionRef.current.subscribe(
          event.stream,
          "subscriber",
          {
            insertMode: "replace",
            width: "100%",
            height: "100%",
            showControls: false,
          },
          (error) => {
            if (error) {
              toast.error("Error connecting to other participant's stream");
              setConnectionQuality('poor');
            } else {
              setConnectionQuality('good');
            }
          }
        );
      });

      // Handle stream destroyed
      sessionRef.current.on("streamDestroyed", (event) => {
        setParticipantCount(prev => Math.max(0, prev - 1));
      });

      // Handle session events
      sessionRef.current.on("sessionConnected", () => {
        setIsConnected(true);
        setIsLoading(false);
        startDurationTimer();

        // Initialize publisher AFTER session connects
        publisherRef.current = window.OT.initPublisher(
          "publisher",
          {
            insertMode: "replace",
            width: "100%",
            height: "100%",
            publishAudio: isAudioEnabled,
            publishVideo: isVideoEnabled,
            showControls: false,
            style: {
              buttonDisplayMode: 'off'
            }
          },
          (error) => {
            if (error) {
              console.error("Publisher error:", error);
              toast.error("Error initializing your camera and microphone");
            }
          }
        );
      });

      sessionRef.current.on("sessionDisconnected", () => {
        setIsConnected(false);
        stopDurationTimer();
        setParticipantCount(0);
      });

      // Connection quality monitoring
      sessionRef.current.on("connectionCreated", () => {
        setConnectionQuality('good');
      });

      // Connect to the session
      sessionRef.current.connect(token, (error) => {
        if (error) {
          toast.error("Error connecting to video session");
          setConnectionQuality('poor');
        } else {
          // Publish your stream AFTER connecting
          if (publisherRef.current) {
            sessionRef.current.publish(publisherRef.current, (error) => {
              if (error) {
                console.log("Error publishing stream:", error);
                toast.error("Error publishing your stream");
              }
            });
          }
        }
      });
    } catch (error) {
      toast.error("Failed to initialize video call");
      setIsLoading(false);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (publisherRef.current) {
      publisherRef.current.publishVideo(!isVideoEnabled);
      setIsVideoEnabled((prev) => !prev);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (publisherRef.current) {
      publisherRef.current.publishAudio(!isAudioEnabled);
      setIsAudioEnabled((prev) => !prev);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // End call
  const endCall = () => {
    stopDurationTimer();
    
    // Properly destroying publisher
    if (publisherRef.current) {
      publisherRef.current.destroy();
      publisherRef.current = null;
    }

    // Disconnect session
    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }

    toast.success("Call ended");
    router.push("/appointments");
  };

  // Cleanup on unmount
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      stopDurationTimer();
      if (publisherRef.current) {
        publisherRef.current.destroy();
      }
      if (sessionRef.current) {
        sessionRef.current.disconnect();
      }
    };
  }, []);

  if (!sessionId || !token || !appId) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4'>
        <div className='text-center max-w-md'>
          <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-8 mb-6'>
            <PhoneOff className='h-16 w-16 text-red-400 mx-auto mb-4' />
            <h1 className='text-2xl font-bold text-white mb-2'>
              Invalid Video Call
            </h1>
            <p className='text-slate-400 text-sm'>
              Missing required parameters for the video call
            </p>
          </div>
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
            onClick={() => router.push("/appointments")}
          >
            Back to Appointments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src='https://unpkg.com/@vonage/client-sdk-video@latest/dist/js/opentok.js'
        onLoad={handleScriptLoaded}
        onError={() => {
          toast.error("Failed to load the video call");
          setIsLoading(false);
        }}
      />

      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        {/* Header */}
        <div className='bg-black/20 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3'>
          <div className='container mx-auto flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <h1 className='text-lg font-semibold text-white'>
                Video Consultation
              </h1>
              {isConnected && (
                <div className='flex items-center space-x-2'>
                  <div className={`h-2 w-2 rounded-full ${
                    connectionQuality === 'good' ? 'bg-green-400' : 
                    connectionQuality === 'fair' ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <span className='text-sm text-slate-300'>
                    {formatDuration(callDuration)}
                  </span>
                </div>
              )}
            </div>
            
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-slate-400 hidden sm:block'>
                {isConnected ? `${participantCount + 1} participants` : 'Connecting...'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
                className='text-slate-300 hover:text-white hover:bg-slate-700/50'
              >
                {isFullscreen ? <Minimize className='h-4 w-4' /> : <Maximize className='h-4 w-4' />}
              </Button>
            </div>
          </div>
        </div>

        <div className='container mx-auto px-4 py-6 h-[calc(100vh-80px)]'>
          {isLoading && !scriptLoading ? (
            <div className='flex flex-col items-center justify-center h-full'>
              <div className='bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 text-center border border-slate-700/50'>
                <Loader2 className='h-12 w-12 text-emerald-400 animate-spin mb-4 mx-auto' />
                <p className='text-white text-lg mb-2'>Setting up your consultation room</p>
                <p className='text-slate-400 text-sm'>Please wait while we connect you...</p>
              </div>
            </div>
          ) : (
            <div className='h-full flex flex-col'>
              {/* Video Grid */}
              <div className='flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6'>
                {/* Self Video */}
                <div className='relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 group'>
                  <div className='absolute top-3 left-3 z-10'>
                    <div className='bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full'>
                      <span className='text-emerald-400 text-sm font-medium'>You</span>
                    </div>
                  </div>
                  
                  {!isVideoEnabled && (
                    <div className='absolute top-3 right-3 z-10'>
                      <div className='bg-red-500/80 backdrop-blur-sm p-2 rounded-full'>
                        <VideoOff className='h-4 w-4 text-white' />
                      </div>
                    </div>
                  )}

                  <div 
                    className='w-full h-full min-h-[300px] lg:min-h-[400px] relative'
                    id='publisher'
                  >
                    {!scriptLoading && !isVideoEnabled && (
                      <div className='flex items-center justify-center h-full bg-slate-900/50'>
                        <div className='text-center'>
                          <div className='bg-slate-700/50 rounded-full p-6 mb-3 mx-auto w-fit'>
                            <User className='h-12 w-12 text-emerald-400' />
                          </div>
                          <p className='text-slate-300 text-sm'>Camera is off</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Other Participant Video */}
                <div className='relative bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 group'>
                  <div className='absolute top-3 left-3 z-10'>
                    <div className='bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full'>
                      <span className='text-emerald-400 text-sm font-medium'>
                        {participantCount > 0 ? 'Participant' : 'Waiting...'}
                      </span>
                    </div>
                  </div>

                  {participantCount === 0 && (
                    <div className='absolute top-3 right-3 z-10'>
                      <div className='bg-yellow-500/80 backdrop-blur-sm p-2 rounded-full animate-pulse'>
                        <User className='h-4 w-4 text-white' />
                      </div>
                    </div>
                  )}

                  <div 
                    id='subscriber'
                    className='w-full h-full min-h-[300px] lg:min-h-[400px] relative'
                  >
                    {participantCount === 0 && (
                      <div className='flex items-center justify-center h-full bg-slate-900/50'>
                        <div className='text-center'>
                          <div className='bg-slate-700/50 rounded-full p-6 mb-3 mx-auto w-fit'>
                            <User className='h-12 w-12 text-slate-400' />
                          </div>
                          <p className='text-slate-300 text-sm mb-2'>Waiting for participant</p>
                          <p className='text-slate-500 text-xs'>They will appear here when they join</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className='bg-black/40 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50'>
                <div className='flex items-center justify-center space-x-3'>
                  {/* Audio Toggle */}
                  <Button
                    onClick={toggleAudio}
                    className={`h-12 w-12 rounded-full transition-all duration-200 ${
                      isAudioEnabled
                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {isAudioEnabled ? <Mic className='h-5 w-5' /> : <MicOff className='h-5 w-5' />}
                  </Button>

                  {/* Video Toggle */}
                  <Button
                    onClick={toggleVideo}
                    className={`h-12 w-12 rounded-full transition-all duration-200 ${
                      isVideoEnabled
                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    {isVideoEnabled ? <Video className='h-5 w-5' /> : <VideoOff className='h-5 w-5' />}
                  </Button>

                  {/* End Call */}
                  <Button
                    onClick={endCall}
                    className='h-12 px-6 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 font-medium'
                  >
                    <PhoneOff className='h-5 w-5 mr-2' />
                    End Call
                  </Button>

                  {/* Settings (Desktop only) */}
                  <Button
                    className='h-12 w-12 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200 hidden sm:flex items-center justify-center'
                  >
                    <Settings className='h-5 w-5' />
                  </Button>
                </div>

                {/* Mobile-specific controls row */}
                <div className='sm:hidden mt-3 flex justify-center'>
                  <Button
                    className='h-10 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-full text-sm'
                  >
                    <Settings className='h-4 w-4 mr-2' />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VideoCall;