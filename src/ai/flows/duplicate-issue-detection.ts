'use server';

/**
 * @fileOverview This file implements the duplicate issue detection flow.
 *
 * It contains:
 * - `detectDuplicateIssue`: A function that takes an image and location, compares it with existing issues, and determines if it's a duplicate.
 * - `DuplicateIssueDetectionInput`: The input type for the `detectDuplicateIssue` function.
 * - `DuplicateIssueDetectionOutput`: The output type for the `detectDuplicateIssue` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DuplicateIssueDetectionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the issue, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  location: z.string().describe('The GPS coordinates of the issue.'),
  description: z.string().optional().describe('Optional description of the issue.'),
  existingIssueData: z.string().describe('JSON array of existing issue photo data URIs and descriptions.'),
});
export type DuplicateIssueDetectionInput = z.infer<typeof DuplicateIssueDetectionInputSchema>;

const DuplicateIssueDetectionOutputSchema = z.object({
  isDuplicate: z.boolean().describe('Whether the issue is a duplicate or not.'),
  confidence: z.number().describe('The confidence level of the duplicate detection (0-1).'),
  duplicateIssueId: z.string().optional().describe('The ID of the duplicate issue, if found.'),
});
export type DuplicateIssueDetectionOutput = z.infer<typeof DuplicateIssueDetectionOutputSchema>;

export async function detectDuplicateIssue(
  input: DuplicateIssueDetectionInput
): Promise<DuplicateIssueDetectionOutput> {
  return duplicateIssueDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'duplicateIssueDetectionPrompt',
  input: {schema: DuplicateIssueDetectionInputSchema},
  output: {schema: DuplicateIssueDetectionOutputSchema},
  prompt: `You are an AI assistant that detects duplicate issues based on image analysis and location.

You will be provided with:
1.  A photo of the issue ({{media url=photoDataUri}}).
2.  The GPS coordinates of the issue: {{{location}}}.
3.  An optional description of the issue: {{{description}}}.
4.  A JSON array of existing issues, with each issue containing photo data URI and description: {{{existingIssueData}}}.

Analyze the new issue and compare it with existing issues. Consider both visual similarity (image content) and proximity (location).

Determine if the new issue is a duplicate of any existing issue.

Return your assessment in JSON format, including:
- isDuplicate (boolean): true if the issue is a duplicate, false otherwise.
- confidence (number): Your confidence level in the duplicate detection (0-1).
- duplicateIssueId (string, optional): The ID of the duplicate issue, if found.

If the issue is not a duplicate, the confidence should be low. If the issue is an exact match, the confidence should be high.

If no existing issues are provided in existingIssueData, always return isDuplicate=false with confidence 0.
`,
});

const duplicateIssueDetectionFlow = ai.defineFlow(
  {
    name: 'duplicateIssueDetectionFlow',
    inputSchema: DuplicateIssueDetectionInputSchema,
    outputSchema: DuplicateIssueDetectionOutputSchema,
  },
  async input => {
    if (!input.existingIssueData) {
      return {isDuplicate: false, confidence: 0};
    }

    try {
      JSON.parse(input.existingIssueData);
    } catch (e) {
      console.error('Invalid JSON provided in existingIssueData', e);
      return {isDuplicate: false, confidence: 0};
    }

    const {output} = await prompt(input);
    return output!;
  }
);
