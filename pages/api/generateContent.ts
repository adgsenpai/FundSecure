// pages/api/generateContent.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure that the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { initialPrompt } = req.body;

  // Validate the input data
  if (!initialPrompt) {
    return res.status(400).json({ error: 'Missing initial prompt' });
  }

  try {
    // 1. Generate Project Name
    const projectNameCompletion = await openai.chat.completions.create({
      model: "gpt-4", // Use a valid model name
      messages: [
        { role: "system", content: "You are a creative assistant helping to name crowdfunding projects." },
        {
          role: "user",
          content: `Based on the following project description, suggest a compelling project name:\n\nProject Description: ${initialPrompt}`,
        },
      ],
      temperature: 0.7, // Adjust as needed
      max_tokens: 50,    // Adjust as needed
    });

    //@ts-ignore
    const projectName: string = projectNameCompletion.choices[0].message.content.trim();
    console.log("Generated Project Name:", projectName);

    // 2. Generate Project Description
    const projectDescriptionCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant crafting detailed project descriptions." },
        {
          role: "user",
          content: `Create a short project description for a crowdfunding campaign named "${projectName}".\n\nEnsure the description is clear, engaging, and highlights the urgency and importance of the project.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    //@ts-ignore
    const projectDescription: string = projectDescriptionCompletion.choices[0].message.content.trim();
    console.log("Generated Project Description:", projectDescription);

    // 3. Generate Markdown Write-Up Code
    const markdownWriteUpCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an assistant creating detailed markdown write-ups for crowdfunding projects." },
        {
          role: "user",
          content: `Generate a comprehensive markdown write-up for the crowdfunding project "${projectName}" with the following description:\n\n${projectDescription} for the markdown leverage ### as headings`,
        },
      ],
    });

    //@ts-ignore
    const markdownWriteUpCode: string = markdownWriteUpCompletion.choices[0].message.content.trim();
    console.log("Generated Markdown Write-Up:", markdownWriteUpCode);

    // Send the generated content in the response
    res.status(200).json({ projectName, projectDescription, markdownWriteUpCode });
  } catch (error: any) {
    console.error("Error in API handler:", error);

    // Handle OpenAI-specific errors
    if (error.response && error.response.data && error.response.data.error) {
      return res.status(500).json({ error: error.response.data.error.message });
    }

    // Handle other types of errors
    res.status(500).json({ error: 'Error generating content' });
  }
}
