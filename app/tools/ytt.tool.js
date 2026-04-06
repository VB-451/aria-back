import { YoutubeTranscript } from '@danielxceron/youtube-transcript';

function extractUrlFromPrompt(prompt) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = prompt.match(urlRegex);
  return matches ? matches[0] : null;
}

export async function getYoutubeTranscript(prompt) {
  const videoUrl = extractUrlFromPrompt(prompt);

  if (!videoUrl) {
    console.log("No URL found in prompt.");
    return null;
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl,  {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    });
    const fullText = transcript.map(item => item.text).join(" ");
    return fullText;
  } catch (err) {
    console.error("Error fetching transcript:", err);
    return null;
  }
}
