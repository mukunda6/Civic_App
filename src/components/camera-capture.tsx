
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, RefreshCw, AlertTriangle } from 'lucide-react';
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

  const getCameraPermission = useCallback(async () => {
    // Stop any existing stream before getting a new one
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    const videoConstraints: MediaStreamConstraints = {
        video: { facingMode: { ideal: 'environment' } }
    };

    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia(videoConstraints);
        setStream(mediaStream);
        setHasCameraPermission(true);
    } catch (err) {
        console.warn('Could not get environment camera, trying default camera.', err);
        // Fallback to any available camera if the environment camera is not found
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
            setHasCameraPermission(true);
        } catch (error) {
            console.error('Error accessing any camera:', error);
            setHasCameraPermission(false);
            toast({
                variant: 'destructive',
                title: 'Camera Access Denied',
                description: 'Please enable camera permissions in your browser settings.',
            });
        }
    }
  }, [toast, stream]);

  useEffect(() => {
    getCameraPermission();

    return () => {
      // Clean up the stream when the component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

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
        // Stop the camera stream after capturing the image
        stream?.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    getCameraPermission(); // Re-request the camera stream
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
      return <div className="text-center p-8">Requesting camera permission...</div>
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
