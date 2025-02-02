import { JSDOM } from "jsdom";
import { translate } from "google-translate-api-x";
import { languages } from "./languages";

const getTextNodes = (node) => {
  const textNodes = [];
  if (node.nodeType === 3) {
    textNodes.push(node);
  }
  if (node.hasChildNodes()) {
    node.childNodes.forEach((childNode) => {
      textNodes.push(...getTextNodes(childNode));
    });
  }
  return textNodes;
};

const translateHTML = async (htmlContent, targetLang) => {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  const textNodes = getTextNodes(document.body);
  for (const node of textNodes) {
    const originalText = node.textContent.trim();
    if (originalText) {
      const translatedText = await translate(originalText, { to: targetLang });
      node.textContent = translatedText.text;
    }
  }
  return document.body.innerHTML;
};

async function ParseDOM(obj) {
  for (const lang of languages) {
    obj.translations[lang].answer = await translateHTML(obj.answer, lang);
  }
}

export { ParseDOM };
