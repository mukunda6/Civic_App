

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { addIssue, getIssues } from '@/lib/firebase-service';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { checkImageClarity } from '@/ai/flows/image-clarity-check';
import { detectDuplicateIssue } from '@/ai/flows/duplicate-issue-detection';
import {
  Image as ImageIcon,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Camera,
} from 'lucide-react';
import Image from 'next/image';
import type { AppUser, IssueCategory, EmergencyCategory } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { CameraCapture } from './camera-capture';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const allCategories: (IssueCategory | EmergencyCategory)[] = [
    'Garbage & Waste Management Problems',
    'Water Supply Quality',
    'Drainage Issues',
    'Roads, Footpaths & Infrastructure Damage',
    'Streetlights & Electricity Failures',
    'Parks, Trees & Environmental Concerns',
    'Illegal Constructions & Encroachments',
    'Stray Animals & Public Health Hazards',
    'Sanitation & Toiletry Issues',
    'Mosquito Control & Fogging',
    'Pipeline Burst',
    'Road Accident',
    'Fire Hazard',
    'Medical Waste',
    'Major Blockage',
];

const formSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
  category: z.enum(allCategories as [string, ...string[]]),
  photoDataUri: z.string().nonempty('Please upload or take a photo.'),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

type FormData = z.infer<typeof formSchema>;

interface ReportIssueFormProps {
    user: AppUser,
    isEmergency?: boolean;
    allowedCategories?: (IssueCategory | EmergencyCategory)[];
    categoryTitle?: string;
    categoryPlaceholder?: string;
    initialCategory?: IssueCategory | EmergencyCategory | null;
}

export function ReportIssueForm({ 
    user, 
    isEmergency = false, 
    allowedCategories = allCategories,
    categoryTitle = 'Category',
    categoryPlaceholder = 'Select an issue category',
    initialCategory = null,
}: ReportIssueFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [aiCheckStatus, setAiCheckStatus] = useState<'idle' | 'checking' | 'complete'>('idle');
  const [clarityReason, setClarityReason] = useState<string | undefined>(undefined);
  
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      photoDataUri: '',
      category: initialCategory || undefined,
    },
  });

  useEffect(() => {
    if (initialCategory) {
        form.setValue('category', initialCategory);
    }
  }, [initialCategory, form]);
  
  const resetAiChecks = () => {
    setAiCheckStatus('idle');
    setClarityReason(undefined);
    setIsDuplicate(false);
    form.clearErrors('photoDataUri');
  };

  const processImage = (file: File) => {
    resetAiChecks();
    setAiCheckStatus('checking');
    setImagePreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = async e => {
      const dataUri = e.target?.result as string;
      form.setValue('photoDataUri', dataUri, { shouldValidate: true });

      // Run AI checks in the background
      runAiChecks(dataUri);
    };
    reader.readAsDataURL(file);

    navigator.geolocation.getCurrentPosition(
      position => {
        form.setValue('location', {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        toast({
          variant: 'destructive',
          title: 'Location Error',
          description: 'Could not get your location. Please enable location services.',
        });
      }
    );
  };
  
  const runAiChecks = async (photoDataUri: string) => {
    try {
        const location = await new Promise<{lat: number, lng: number}>((resolve, reject) => {
             navigator.geolocation.getCurrentPosition(
                (position) => resolve({lat: position.coords.latitude, lng: position.coords.longitude}),
                (error) => reject(error)
            );
        });
        form.setValue('location', location);


        const [clarityResult, existingIssues] = await Promise.all([
            checkImageClarity({ photoDataUri }),
            getIssues()
        ]);
        
        // Process clarity result
        if (!clarityResult.isClear) {
            setClarityReason(clarityResult.reason);
            form.setError('photoDataUri', {
                type: 'manual',
                message: clarityResult.reason || 'Image is not clear. Please try another.',
            });
        }
        
        // Process duplicate detection result
        if (clarityResult.isClear) {
            const duplicateResult = await detectDuplicateIssue({
                photoDataUri,
                location: `${location.lat}, ${location.lng}`,
                description: form.getValues('description'),
                existingIssueData: JSON.stringify(existingIssues.map(i => ({id: i.id, title: i.title, description: i.description, location: i.location}))),
            });

            if (duplicateResult.isDuplicate && duplicateResult.duplicateIssueId) {
                setIsDuplicate(true);
                toast({
                    title: 'Issue Already Reported',
                    description: 'This issue has already been reported and is in process. Thank you!',
                    duration: 6000,
                });
                form.setError('photoDataUri', {
                    type: 'manual',
                    message: 'This issue has already been reported.'
                });
            }
        }

    } catch (error) {
        console.error('AI checks failed:', error);
        toast({
            variant: 'destructive',
            title: 'AI Analysis Failed',
            description: 'Could not analyze the image. Please try again.',
        });
    } finally {
        setAiCheckStatus('complete');
    }
  }


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handlePhotoTaken = (file: File) => {
    setIsCameraOpen(false);
    processImage(file);
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
        const newIssue = await addIssue({ ...data, isEmergency }, user);
        toast({
        title: 'Report Submitted!',
        description: isEmergency ? 'Your emergency report has been prioritized.' : 'Thank you for helping improve your community.',
        });
        form.reset();
        setImagePreview(null);
        resetAiChecks();
        router.push(`/dashboard?newIssueId=${newIssue.id}`);
    } catch (error) {
        console.error('Error adding issue:', error);
        toast({ variant: 'destructive', title: 'Submission Error', description: 'Could not save your report.'});
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const photoInputId = `file-upload-${isEmergency ? 'emergency' : 'standard'}`;
  const isAiChecking = aiCheckStatus === 'checking';
  const isImageUnclear = aiCheckStatus === 'complete' && !!clarityReason;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="photoDataUri"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Photo</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={photoInputId}
                      onChange={handleFileChange}
                      disabled={isAiChecking}
                    />
                    <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={200}
                          height={192}
                          className="object-cover h-full w-full rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-4">
                          <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                          <label
                            htmlFor={photoInputId}
                            className={cn("font-semibold text-primary cursor-pointer hover:underline", isAiChecking && "pointer-events-none opacity-50")}
                          >
                            Upload a file
                          </label>
                          <p className="text-sm text-muted-foreground my-1">or</p>
                          <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" disabled={isAiChecking}>
                                <Camera className="mr-2 h-4 w-4" />
                                Take Photo
                              </Button>
                            </DialogTrigger>
                             <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                    <DialogTitle>Live Camera Capture</DialogTitle>
                                </DialogHeader>
                                <CameraCapture onPhotoTaken={handlePhotoTaken} />
                             </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </div>
                  </div>
                </FormControl>
                {aiCheckStatus !== 'idle' && !isDuplicate && (
                    <FormDescription className="flex items-center gap-2">
                        {isAiChecking && <> <Loader2 className="h-4 w-4 animate-spin"/> Analyzing image clarity and checking for duplicates...</>}
                        {aiCheckStatus === 'complete' && !isImageUnclear && <> <CheckCircle className="h-4 w-4 text-green-500"/> AI checks complete. Image is clear.</>}
                        {isImageUnclear && <> <AlertTriangle className="h-4 w-4 text-destructive"/> Image may be unclear. Reason: {clarityReason}</>}
                    </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{categoryTitle}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={categoryPlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {allowedCategories.map((cat, index) => (
                        <SelectItem key={index} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the issue in detail..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

           <Button 
            type="submit" 
            disabled={isSubmitting || isAiChecking || isImageUnclear || isDuplicate} 
            className={cn("w-full", isEmergency && "bg-destructive hover:bg-destructive/90")}
            >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isAiChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEmergency && <AlertTriangle className="mr-2 h-4 w-4" />}
                {isAiChecking ? 'Analyzing...' : 'Submit Report'}
            </Button>
        </form>
      </Form>
    </>
  );
}
