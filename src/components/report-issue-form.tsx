
'use client';

import { useState } from 'react';
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
import { checkImageClarity } from '@/ai/flows/image-clarity-check';
import { detectDuplicateIssue } from '@/ai/flows/duplicate-issue-detection';
import {
  Image as ImageIcon,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';
import type { AppUser } from '@/lib/types';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  description: z.string().min(10, 'Please provide a more detailed description.'),
  category: z.enum(['Garbage', 'Streetlights', 'Manholes', 'Water Quality', 'Potholes']),
  photoDataUri: z.string().nonempty('Please upload a photo.'),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

type FormData = z.infer<typeof formSchema>;

export function ReportIssueForm({ user }: { user: AppUser }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageClarity, setImageClarity] = useState<{
    status: 'idle' | 'checking' | 'clear' | 'unclear';
    reason?: string;
  }>({ status: 'idle' });
  const [duplicateInfo, setDuplicateInfo] = useState<{
    isDuplicate: boolean;
    duplicateIssueId?: string;
  } | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      photoDataUri: '',
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    setImageClarity({ status: 'checking' });
    setImagePreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = async e => {
      const dataUri = e.target?.result as string;
      form.setValue('photoDataUri', dataUri);

      try {
        const clarityResult = await checkImageClarity({ photoDataUri: dataUri });
        if (clarityResult.isClear) {
          setImageClarity({ status: 'clear' });
        } else {
          setImageClarity({ status: 'unclear', reason: clarityResult.reason });
          form.setError('photoDataUri', {
            type: 'manual',
            message:
              clarityResult.reason || 'Image is not clear. Please try another.',
          });
        }
      } catch (error) {
        console.error('Clarity check failed:', error);
        setImageClarity({ status: 'idle' }); // Reset on error
        toast({
          variant: 'destructive',
          title: 'Clarity Check Failed',
          description: 'Could not analyze the image. Please try again.',
        });
      }
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

  const onSubmit = async (data: FormData) => {
    if (imageClarity.status !== 'clear') {
        toast({
            variant: 'destructive',
            title: 'Unclear Image',
            description: 'Please upload a clear image before submitting.',
        });
        return;
    }
    
    setIsSubmitting(true);
    try {
      const existingIssues = await getIssues();
      const existingIssueData = JSON.stringify(
        existingIssues.map(i => ({ id: i.id, description: i.description }))
      );

      const duplicateResult = await detectDuplicateIssue({
        ...data,
        location: `${data.location.lat}, ${data.location.lng}`,
        existingIssueData,
      });

      if (duplicateResult.isDuplicate && duplicateResult.confidence > 0.5) {
        setDuplicateInfo(duplicateResult);
      } else {
        await finishSubmission();
      }
    } catch (error) {
      console.error('Submission failed:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const finishSubmission = async () => {
    const data = form.getValues();
    if (!imageFile) {
        toast({ variant: 'destructive', title: 'Error', description: 'No image file selected.' });
        return;
    }

    try {
        const newIssue = await addIssue(data, imageFile, user);
        toast({
        title: 'Report Submitted!',
        description: 'Thank you for helping improve your community.',
        });
        form.reset();
        setImagePreview(null);
        setImageClarity({status: 'idle'});
        setDuplicateInfo(null);
        router.push(`/issues/${newIssue.id}`);
    } catch (error) {
        console.error('Error adding issue:', error);
        toast({ variant: 'destructive', title: 'Submission Error', description: 'Could not save your report.'});
    }
  };

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
                      id="file-upload"
                      onChange={handleFileChange}
                      disabled={imageClarity.status === 'checking'}
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={200}
                          height={192}
                          className="object-cover h-full w-full rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-8 h-8 mb-4 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Click to upload</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG or GIF
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </FormControl>
                {imageClarity.status !== 'idle' && (
                    <FormDescription className="flex items-center gap-2">
                        {imageClarity.status === 'checking' && <> <Loader2 className="h-4 w-4 animate-spin"/> Checking image clarity...</>}
                        {imageClarity.status === 'clear' && <> <CheckCircle className="h-4 w-4 text-green-500"/> Image is clear.</>}
                        {imageClarity.status === 'unclear' && <> <AlertTriangle className="h-4 w-4 text-destructive"/> Image may be unclear. Reason: {imageClarity.reason}</>}
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
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an issue category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Potholes">Potholes</SelectItem>
                    <SelectItem value="Garbage">Garbage</SelectItem>
                    <SelectItem value="Streetlights">Streetlights</SelectItem>
                    <SelectItem value="Manholes">Manholes</SelectItem>
                    <SelectItem value="Water Quality">Water Quality</SelectItem>
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

          <Button type="submit" disabled={isSubmitting || imageClarity.status === 'checking'} className="w-full">
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit Report
          </Button>
        </form>
      </Form>
      <AlertDialog open={!!duplicateInfo} onOpenChange={() => setDuplicateInfo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Possible Duplicate Detected</AlertDialogTitle>
            <AlertDialogDescription>
              Our AI has detected that your report might be a duplicate of an
              existing issue. Please review before submitting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={finishSubmission}>
              Submit Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
