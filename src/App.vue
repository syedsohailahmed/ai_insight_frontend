<template>
  <div class="w-96 p-4 bg-white shadow-lg rounded-xl font-sans">
    <h2 class="text-xl font-bold text-gray-800 text-center">AI Product Insights</h2>
    <p class="text-m text-gray-500 mt-1 text-center">Quick insights & similar items</p>


    <!-- Loading -->
    <div v-if="loading" class="text-center text-blue-500 mb-4">
      Analyzing product...
    </div>

    <!-- Error -->
    <div v-if="error" class="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
      {{ error }}
    </div>

    <!-- Product Analysis -->
    <AnalysisCard v-if="result" :analysisData="result" />

    <!-- Analyze Button -->
    <button @click="analyzeProduct"
      class="w-full mt-4 py-2 px-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors">
      Analyze Product
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AnalysisCard from "./AnalysisCard.vue";

const result = ref(null);
const loading = ref(false);
const error = ref(null);


function getProductFromPage() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs?.[0]?.id;
      if (!tabId) return resolve({ error: "No active tab" });

      chrome.tabs.sendMessage(tabId, { action: "getProductInfo" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Message failed:", chrome.runtime.lastError.message);
          return resolve({ error: chrome.runtime.lastError.message });
        }
        resolve(response || { error: "No response from content script" });
      });
    });
  });
}

async function analyzeProduct() {
  loading.value = true;
  error.value = null;
  result.value = null;

  try {
    const productInfo = await getProductFromPage();
    console.log('productInfo', productInfo);

    if (!productInfo || Object.keys(productInfo).length === 0) {
      error.value = "Failed to get product info";
      loading.value = false;
      return;
    }
    const response = await fetch("https://ai-insight-backend.vercel.app/api/analyze-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productInfo),
    });

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    result.value = data;
  } catch (err) {
    console.error(err);
    error.value = "Failed to analyze product.";
  } finally {
    loading.value = false;
  }
}

// onMounted(() => {
//   result.value = {
//     analysis: {
//       summary:
//         "Deeply discounted men’s waterproof/hiker-style boots with solid reviews but unclear branding due to mixed product info.",
//       pros: [
//         "Very low price at $19.99",
//         "High original MSRP ($210) implies strong value if authentic",
//         "4.2 rating across 500+ reviews",
//         "Waterproof/hiker design suitable for varied weather"
//       ],
//       cons: [
//         "Brand confusion between Timberland and Weatherproof Vintage",
//         "Possible mismatch between title and actual product",
//         "Deep discount may indicate limited sizes, colors, or overstock"
//       ],
//       hiddenIssues: [
//         "Potential listing error due to conflicting product names",
//         "Authenticity or model accuracy needs verification",
//         "Return policy and warranty unclear"
//       ],
//       alternatives: [
//         "Levi's hiking or work boots",
//         "Timberland official 6-inch Premium Boots directly from Timberland",
//         "Weatherproof Vintage Jace Hiker Boots from verified retailers"
//       ],
//       priceInsight:
//         "A 75% discount down to $19.99 is unusually low for any boot originally listed at $210, strongly suggesting clearance or last-season inventory. Good value if the product details are confirmed.",
//       buyScore: 78
//     },
//     reviewSummary: {
//       pros: [],
//       cons: [],
//       rating: 0
//     },
//     similar: [
//       {
//         description:
//           "Women's Casual Classic Mid Rise Bootcut Jeans",
//         price: "$41.65",
//         title: "Levi's",
//         url: "https://www.macys.com/shop/product/levis-womens-casual-classic-mid-rise-bootcut-jeans?ID=5085731&swatchColor=Island%20Rinse"
//       },
//       {
//         description: "",
//         price: "",
//         title: "AI Sidebar Widget",
//         url: "chrome-extension://mfchgdpmkaikidbppjajegpphpehainc/index.html"
//       }
//     ]
//   };
// });
</script>


<style scoped>
/* Optional scrollbar styling */
ul::-webkit-scrollbar {
  width: 6px;
}

ul::-webkit-scrollbar-thumb {
  background-color: rgba(107, 114, 128, 0.5);
  border-radius: 3px;
}
</style>
