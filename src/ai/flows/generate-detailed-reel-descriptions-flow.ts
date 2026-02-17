'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating detailed shooting and editing descriptions for a video reel hook.
 *
 * - generateDetailedReelDescriptions - A function that orchestrates the generation of detailed reel descriptions.
 * - GenerateDetailedReelDescriptionsInput - The input type for the generateDetailedReelDescriptions function.
 * - GenerateDetailedReelDescriptionsOutput - The return type for the generateDetailedReelDescriptions function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateDetailedReelDescriptionsInputSchema = z.object({
  reelHook: z.string().describe('The catchy hook for the reel, for which detailed shooting and editing instructions are needed.'),
});
export type GenerateDetailedReelDescriptionsInput = z.infer<typeof GenerateDetailedReelDescriptionsInputSchema>;

const GenerateDetailedReelDescriptionsOutputSchema = z.object({
  detailedDescription: z.string().describe('A detailed, bulleted description on how to shoot and edit the reel, including specific transitions and highlighted keywords. Keywords are marked with markdown bold (**keyword**).'),
});
export type GenerateDetailedReelDescriptionsOutput = z.infer<typeof GenerateDetailedReelDescriptionsOutputSchema>;

/**
 * Generates a detailed, bulleted description on how to shoot and edit a reel based on a given hook.
 * The description includes specific transitions and highlighted keywords for easy understanding.
 */
const generateDetailedReelDescriptionsPrompt = ai.definePrompt({
  name: 'generateDetailedReelDescriptionsPrompt',
  input: { schema: GenerateDetailedReelDescriptionsInputSchema },
  output: { schema: GenerateDetailedReelDescriptionsOutputSchema },
  prompt: `You are an expert video editor and director. Your task is to provide a detailed, bulleted description for shooting and editing a short video reel based on the given hook. The description should cover camera shots, editing techniques, specific transitions, and highlight key words or phrases using markdown bold (**keyword**).

Structure your response clearly with headings like "Shooting Guide", "Editing Guide", and "Transitions".

Reel Hook: {{{reelHook}}}

**Shooting Guide:**
- Consider a **dynamic opening shot** using a **tracking motion** to immediately grab attention.
- Use a **mix of close-ups** to emphasize details and **wide shots** for context. Ensure good **lighting** for clarity.

**Editing Guide:**
- Maintain a **fast pace** to keep viewers engaged. Keep clips **short and impactful**.
- Utilize **sound design** effectively, including **background music** and **sound effects** to enhance the mood.
- Implement **color grading** to create a consistent and **professional look**.

**Transitions:**
- Use **jump cuts** for quick, energetic scene changes. Alternatively, explore **L-cuts** or **J-cuts** for seamless audio transitions.
- A **match cut** can create visual continuity between different scenes. Consider a **whip pan** for an exciting transition.`,
});

const generateDetailedReelDescriptionsFlow = ai.defineFlow(
  {
    name: 'generateDetailedReelDescriptionsFlow',
    inputSchema: GenerateDetailedReelDescriptionsInputSchema,
    outputSchema: GenerateDetailedReelDescriptionsOutputSchema,
  },
  async (input) => {
    const { output } = await generateDetailedReelDescriptionsPrompt(input);
    return output!;
  }
);

export async function generateDetailedReelDescriptions(input: GenerateDetailedReelDescriptionsInput): Promise<GenerateDetailedReelDescriptionsOutput> {
  return generateDetailedReelDescriptionsFlow(input);
}
