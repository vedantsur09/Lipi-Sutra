const GOOGLE_KEY = "AIzaSyCycvn7VgYU4V3ydmCna_z2U3P4Ll_7QGE";

export async function getConfidenceScores(base64Image) {
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [{
          image: { content: base64Image },
          features: [{ type: "DOCUMENT_TEXT_DETECTION" }]
        }]
      })
    }
  );
  const data = await response.json();
  const words = [];
  const pages = data.responses[0]?.fullTextAnnotation?.pages || [];
  pages.forEach(page =>
    page.blocks?.forEach(block =>
      block.paragraphs?.forEach(para =>
        para.words?.forEach(word => {
          const text = word.symbols?.map(s => s.text).join("") || "";
          words.push({ word: text, confidence: word.confidence || 0 });
        })
      )
    )
  );
  return words;
}