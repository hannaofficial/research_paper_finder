import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

function cleanResponse(text) {
  
  text = text.replace(/```json\s*([\s\S]*?)\s*```/g, '$1').trim();
  
 
  text = text.replace(/`/g, '');

  return text;
}

export async function POST(request) {
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  };

  const { question } = await request.json();
  const prompt = `Provide 2-3 max foundational research papers on: ${question} such that I can understand the everything about the topic
Return as JSON array: [{name, author, published_date, citation, importance, link ,icon of the website}]
If not about  research paper related  to science,biology,math,physics,chemistry,economics,AI,CS,finance,engineering, return {"error": "Invalid query. Ask about edu research in specified fields."}`;


  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 175500); 
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    }, { signal: controller.signal });

    clearTimeout(timeoutId);

    const responseText = result.response.text();
    console.log("Raw response:", responseText);  

    const cleanedResponse = cleanResponse(responseText);
    console.log("Cleaned response:", cleanedResponse);  

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return NextResponse.json({ error: 'Invalid response format', rawResponse: cleanedResponse }, { status: 500 });
    }

    return NextResponse.json({ answer: parsedResponse });
  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json({ error: 'Error generating response' }, { status: 500 });
  }
}