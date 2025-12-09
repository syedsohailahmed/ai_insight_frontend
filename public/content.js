console.log("Content script loaded");

// Safely get text from a selector
function getText(selector) {
  return document.querySelector(selector)?.innerText?.trim() || "";
}

// Get product title
function getTitle() {
  try {
    const selectors = ["h1", ".product-title", "[class*='title']", "[id*='title']"];
    for (const sel of selectors) {
      const text = getText(sel);
      if (text.length > 3) return text;
    }
    return document.title || "No title found";
  } catch (err) {
    console.error("getTitle error:", err);
    return "No title found";
  }
}

// Get product price
function getPrice() {
  try {
    const selectors = [".price", ".product-price", "[class*='price']", "[id*='price']"];
    for (const sel of selectors) {
      const text = getText(sel);
      if (/\d/.test(text)) return text;
    }
    return "No price found";
  } catch (err) {
    console.error("getPrice error:", err);
    return "No price found";
  }
}

// Get product description
function getDescription() {
  try {
    const selectors = [
      ".product-description",
      "#description",
      "[class*='description']",
      "[id*='description']",
      ".description"
    ];
    for (const sel of selectors) {
      const text = getText(sel);
      if (text.length > 20) return text;
    }
    return "No description found";
  } catch (err) {
    console.error("getDescription error:", err);
    return "No description found";
  }
}

// Get product reviews
function getReviews() {
  try {
    const elems = document.querySelectorAll("[class*='review'], [id*='review']");
    if (!elems || elems.length === 0) return ["No reviews found"];

    const reviews = Array.from(elems)
      .map(el => el.innerText?.trim())
      .filter(text => text && text.length > 20);

    return reviews.length ? reviews : ["No reviews found"];
  } catch (err) {
    console.error("getReviews error:", err);
    return ["No reviews found"];
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getProductInfo") {
    try {
      const productInfo = {
        url: window.location.href,
        title: getTitle(),
        price: getPrice(),
        description: getDescription(),
        reviews: getReviews(),
      };
      console.log("Product info extracted:", productInfo);
      sendResponse(productInfo);
    } catch (err) {
      console.error("Failed to extract product info:", err);
      sendResponse({ error: "Failed to extract product info" });
    }
  }
  return true; // keep channel open for async response
});
