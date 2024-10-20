// pages/api/generateImage.ts

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

    const { prompt } = req.body;

    // Validate the input data
    if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt for image generation' });
    }

    try {
        // Generate an image using OpenAI API

        // engineer a prompt to generate a cool graphic
        const imagePrompt = await openai.chat.completions.create({
            model: "gpt-4o", // Use a valid model name
            messages: [
                { role: "system", content: "You are a creative assistant helping to generate cool graphics." },
                {
                    role: "user",
                    content: `Based on the following description, generate a cool graphic:\n\nDescription: ${prompt}`,
                },
            ],
        });
        // @ts-ignore
        const markdownWriteUpCode: string = imagePrompt.choices[0].message.content.trim();
        //@ts-ignore
        const imageResponse = await openai.images.generate({
            prompt: markdownWriteUpCode,
            model: "dall-e-3",
            n: 1, // Number of images to generate            
            // wide banner
            size: "1792x1024",
            response_format: "url", // Can be "url" or "b64_json"
        });

        // Extract the image URL
        const imageUrl = imageResponse.data[0].url;

        // Send the image URL in the response
        res.status(200).json({
            "imageUrl": imageUrl
        });
    } catch (error: any) {
        console.error("Error generating image:", error);

        // Handle OpenAI-specific errors
        if (error.response && error.response.data && error.response.data.error) {
            return res.status(500).json({ error: error.response.data.error.message });
        }

        // Handle other types of errors
        res.status(500).json({ error: 'Error generating image' });
    }
}
