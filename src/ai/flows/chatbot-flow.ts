
'use server';
/**
 * @fileOverview A chatbot AI agent for the CivicSolve application.
 *
 * This file implements the core logic for the GHMC Chatbot Assistant.
 * - chatbotFlow - A function that handles the conversational exchange.
 * - getMyIssues - A Genkit tool that allows the AI to fetch a user's reported issues.
 */

import {ai} from '@/ai/genkit';
import {getIssuesByUser} from '@/lib/firebase-service';
import {z} from 'zod';

// Tool for the AI to get the user's reported issues.
const getMyIssues = ai.defineTool(
  {
    name: 'getMyIssues',
    description: 'Get a list of all issues reported by the current user.',
    inputSchema: z.object({
      userId: z.string().describe("The current user's ID."),
    }),
    outputSchema: z.string().describe('A JSON string of the user\'s issues.'),
  },
  async ({userId}) => {
    const issues = await getIssuesByUser(userId);
    // Return a simplified summary for the AI to process.
    const summary = issues.map(issue => ({
      id: issue.id,
      title: issue.title,
      category: issue.category,
      status: issue.status,
      submittedAt: issue.submittedAt,
    }));
    return JSON.stringify(summary);
  }
);

// The main chatbot flow
export const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: z.object({
      userId: z.string(),
      history: z.any(),
      prompt: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({userId, history, prompt}) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      tools: [getMyIssues],
      history,
      prompt: prompt,
      system: `You are a friendly and efficient digital assistant for the GHMC (Greater Hyderabad Municipal Corporation). Your name is 'CivicBot'. Your goal is to help citizens with their civic issues.

      You are having a conversation with a user whose ID is: ${userId}. Use this ID when you need to call tools that require it.

      **Your Capabilities:**
      1.  **Check Complaint Status:** You can check the status of a user's submitted complaints. If a user asks about their issues, use the 'getMyIssues' tool to fetch their data and provide a summary.
      2.  **Provide Guidance:** You must guide users on what issues GHMC handles and what it doesn't.
          - **GHMC Issues:** Garbage, Streetlights, Water Leakage/Supply, Road Damage, Drainage, Stray Animals, Parks, Public Facilities.
          - **Non-GHMC Issues:** For issues outside GHMC's scope, provide the correct helpline.
              - **Electricity Board (for power outages):** Call 1912.
              - **Water Works (for billing issues):** Call 155313.
              - **Police (for criminal activity):** Call 100.
      3.  **Be Conversational:** Talk in a natural, helpful, and polite manner. Keep your responses concise.

      **Conversation Example:**
      User: What's the status of my garbage complaint?
      AI: (Uses getMyIssues tool with the user's ID) -> I see you reported an issue about 'Overflowing trash can'. It is currently 'In Progress'. A team has been assigned to it.
      User: what about my other issue
      AI: (Uses getMyIssues tool with the user's ID) -> You also reported a 'Large pothole on Main St', which has been 'Resolved'.

      **IMPORTANT:**
      - Do not offer to report issues yet. That feature is coming soon.
      - Do not make up information. If you don't know, say so.
      - You do not support other languages yet. If asked, say you can only speak English for now.`,
    });

    return llmResponse.text;
  }
);
