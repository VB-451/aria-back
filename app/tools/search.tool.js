import fetch from "node-fetch";
import * as cheerio from "cheerio";

function decodeDuckDuckGoUrl(url) {
  try {
    const match = url.match(/[?&]uddg=([^&]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
    return url;
  } catch {
    return url;
  }
}

async function scrapeDuckDuckGo(query, limit = 3) {
  try {
    const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    const results = [];
    $("a.result__a").each((i, el) => {
        if (i >= limit) return false;

        const title = $(el).text().trim();
        let url = $(el).attr("href")?.trim();

        if (url) url = decodeDuckDuckGoUrl(url);

        const snippet = $(el).closest(".result").find(".result__snippet").text().trim();

        if (title && url) results.push({ title, url, snippet });
    });
    
    return results;
  } catch (err) {
    console.error("DuckDuckGo scraping error:", err);
    return [];
  }
}

async function fetchPageText(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    let text = "";
    $("p").each((i, el) => {
      const t = $(el).text().trim();
      if (t.length > 20) text += t + "\n\n";
    });

    if (!text) text = $("body").text().trim();

    return text.replace(/\s+/g, " ").slice(0, 3000);
  } catch (err) {
    console.error("Error fetching page text:", err);
    return "";
  }
}

export async function webSearch(query) {
  const results = await scrapeDuckDuckGo(query, 3);
  if (results.length === 0) return "No relevant results found.";
  
  const texts = [];
  for (const r of results) {
    const pageText = await fetchPageText(r.url);
    if (pageText) {
      texts.push(`Title: ${r.title}\nURL: ${r.url}\n${pageText}`);
    }
  }

  return texts.join("\n\n---\n\n");
}
