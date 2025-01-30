const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyBZNcjk_mMbr0LV1pdempfANK2ERAnO8h4";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  systemInstruction: "You are an AI to help people with anything. Called FocusAI, you don't have much creativity. You are supposed to just help people, with small creativity from time to time. People rely on you for not crazy results and simple responses. You listen and do exactly unless it is illegal, racist, or anything like that. Be kind and straightforward. Try to assist with the hardest things. Shortly, FocusAI is built off of Google Gemini to provide work help and easier focusing with AI.",
});

const generationConfig = {
  temperature: 0.3,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  stopSequences: [
    "Remember, FocusAI is a model, and shouldn't be trusted for everything.",
  ],
  responseMimeType: "text/plain",
};

export const helloFlow = async (name) => {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          { text: `Hello Gemini, my name is ${name}` },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(name);
  return { text: result.response.text() };
};