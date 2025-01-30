// import the Genkit and Google AI plugin libraries
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';

// configure a Genkit instance
const ai = genkit({
  plugins: [googleAI({ apiKey: 'AIzaSyBZNcjk_mMbr0LV1pdempfANK2ERAnO8h4' })],
  model: gemini15Flash, // set default model
});

export const helloFlow = ai.defineFlow('helloFlow', async (name) => {
  // make a generation request
  const { text } = await ai.generate(`Hello Gemini, my name is ${name}`);
  return { text };
});