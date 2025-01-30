const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBZNcjk_mMbr0LV1pdempfANK2ERAnO8h4");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const helloFlow = async (name) => {
  const prompt = `${name}}`;
  const result = await model.generateContent(prompt);
  return { text: result.response.text() };
};