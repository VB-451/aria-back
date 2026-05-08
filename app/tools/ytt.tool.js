import { fetchTranscript } from 'youtube-transcript-plus'; 

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
    const transcript = await fetchTranscript(videoUrl)
    const fullText = transcript.map(item => item.text).join(" ");
    return fullText;
  } catch (err) {
    console.error("Error fetching transcript:", err);
    return null;
  }
}
