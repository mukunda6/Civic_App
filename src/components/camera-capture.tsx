
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface CameraCaptureProps {
  onPhotoTaken: (file: File) => void;
}

export function CameraCapture({ onPhotoTaken }: CameraCaptureProps) {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const cleanupStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const requestCameraPermission = useCallback(async () => {
    setHasCameraPermission(null);
    cleanupStream();

    const getCamera = async (constraints: MediaStreamConstraints) => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            setHasCameraPermission(true);
            return true;
        } catch (err) {
            return false;
        }
    }

    // 1. Try environment camera
    if (await getCamera({ video: { facingMode: { ideal: 'environment' } } })) return;
    
    console.warn('Could not get environment camera, trying default camera.');
    
    // 2. Fallback to any camera
    if (await getCamera({ video: true })) return;

    // 3. If all fail, show error
    console.error('Error accessing any camera.');
    setHasCameraPermission(false);
    toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: 'Please enable camera permissions in your browser settings.',
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]); // cleanupStream is not needed here as it's stable

  useEffect(() => {
    requestCameraPermission();

    // Ensure stream is cleaned up when the component unmounts.
    return () => {
      cleanupStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        cleanupStream(); // Stop the camera stream after capturing the image
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    requestCameraPermission(); // Re-request the camera stream
  };

  const handleConfirm = () => {
    if (capturedImage) {
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onPhotoTaken(file);
        });
    }
  };

  if (hasCameraPermission === false) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Camera Access Required</AlertTitle>
        <AlertDescription>
          We couldn't access your device's camera. Please grant camera permissions in your browser's settings and refresh the page.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (hasCameraPermission === null) {
      return (
        <div className="flex items-center justify-center h-48 text-center p-8">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Requesting camera permission...
        </div>
      );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
        ) : (
          <video ref={videoRef} className="w-full h-full object-contain" autoPlay playsInline muted />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex justify-center gap-4">
        {capturedImage ? (
          <>
            <Button variant="outline" onClick={handleRetake}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake
            </Button>
            <Button onClick={handleConfirm}>
              Confirm Photo
            </Button>
          </>
        ) : (
          <Button onClick={handleCapture} disabled={!stream}>
            <Camera className="mr-2 h-4 w-4" />
            Capture
          </Button>
        )}
      </div>
    </div>
  );
}
