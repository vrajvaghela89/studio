'use server';
/**
 * @fileOverview A Genkit flow that generates 5 catchy hooks for a reel idea.
 *
 * - generateReelHooks - A function that handles the generation of reel hooks.
 * - ReelIdeaInput - The input type for the generateReelHooks function.
 * - GenerateReelHooksOutput - The return type for the generateReelHooks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReelIdeaInputSchema = z.object({
  reelIdea: z
    .string()
    .describe('A brief idea for a social media reel.'),
});
export type ReelIdeaInput = z.infer<typeof ReelIdeaInputSchema>;

const GenerateReelHooksOutputSchema = z.object({
  hooks: z
    .array(z.string())
    .length(5)
    .describe('An array of 5 catchy hooks for the reel.'),
});
export type GenerateReelHooksOutput = z.infer<
  typeof GenerateReelHooksOutputSchema
>;

export async function generateReelHooks(
  input: ReelIdeaInput
): Promise<GenerateReelHooksOutput> {
  return generateReelHooksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReelHooksPrompt',
  input: {schema: ReelIdeaInputSchema},
  output: {schema: GenerateReelHooksOutputSchema},
  prompt: `You are an expert social media content creator specializing in creating engaging short-form video content.
Your task is to generate 5 distinct, catchy, and attention-grabbing hooks for a social media reel based on the user's provided reel idea.

Each hook should be designed to maximize audience engagement within the first few seconds of the video.
Focus on intriguing questions, bold statements, or curiosity-inducing phrases.

Reel Idea: {{{reelIdea}}}

Generate exactly 5 hooks as a JSON array of strings.`,
});

const generateReelHooksFlow = ai.defineFlow(
  {
    name: 'generateReelHooksFlow',
    inputSchema: ReelIdeaInputSchema,
    outputSchema: GenerateReelHooksOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
