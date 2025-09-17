
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
  existingIssueData: z.string().describe('JSON array of existing issues, with each issue containing an id and description.'),
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
  prompt: `You are an AI assistant that detects duplicate civic issues.

You will be provided with a new issue submission and a list of existing issues.

**New Issue:**
- Photo: {{media url=photoDataUri}}
- Location (Lat, Lng): {{{location}}}
- Description: {{{description}}}

**Existing Issues (JSON):**
\`\`\`json
{{{existingIssueData}}}
\`\`\`

**Your Task:**
Analyze the new issue and compare it to the existing issues. Your goal is to determine if the new issue is a duplicate of an existing one.
- **Visual Similarity:** Compare the image of the new issue with the implicit images of the existing issues (represented by their descriptions).
- **Semantic Similarity:** Compare the description of the new issue with the descriptions of the existing ones.
- **Location Proximity:** The provided location is a key factor, but do not rely on it exclusively. Issues can be near each other without being duplicates.

**Output:**
Return a JSON object with your assessment.
- `isDuplicate`: A boolean. Set to \`true\` if you are confident it is a duplicate, otherwise \`false\'.
- `confidence`: A number between 0 and 1 representing your confidence. High confidence (e.g., > 0.8) means it's very likely a duplicate. Low confidence means it is likely not a duplicate.
- `duplicateIssueId`: If \`isDuplicate\` is true, provide the \`id\` of the existing issue that it matches.

**IMPORTANT RULES:**
- If \`existingIssueData\` is an empty array or not provided, you MUST return \`{ "isDuplicate": false, "confidence": 0 }\`.
- Base your decision on a holistic view of the image, description, and location. For example, two "pothole" reports at the same coordinates are very likely duplicates. A "pothole" and "broken streetlight" at the same coordinates are not.
`,
});

const duplicateIssueDetectionFlow = ai.defineFlow(
  {
    name: 'duplicateIssueDetectionFlow',
    inputSchema: DuplicateIssueDetectionInputSchema,
    outputSchema: DuplicateIssueDetectionOutputSchema,
  },
  async input => {
    // Handle the case where there are no existing issues to compare against.
    if (!input.existingIssueData || input.existingIssueData === '[]') {
      return {isDuplicate: false, confidence: 0};
    }

    try {
      // Validate that existingIssueData is valid JSON
      JSON.parse(input.existingIssueData);
    } catch (e) {
      console.error('Invalid JSON provided in existingIssueData', e);
      // If JSON is invalid, we cannot perform a check.
      return {isDuplicate: false, confidence: 0};
    }

    const {output} = await prompt(input);
    return output!;
  }
);

    