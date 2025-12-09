<template>
  <div class="max-w-md mx-auto p-2 bg-white rounded-xl shadow-lg font-sans">

    <hr class="my-3" />

    <div class="flex justify-between items-center">
      <h2 class="text-sm font-semibold text-gray-700">Buy Score</h2>
      <div class="text-center">
        <div class="mt-1 inline-flex items-center">
          <div :class="scoreColorClass" class="text-white text-sm font-semibold px-3 py-1 rounded-full mr-2">
            {{ analysisData.analysis.buyScore }}%
          </div>
          <div class="w-24 h-2 bg-gray-200 rounded overflow-hidden">
            <div class="h-full rounded"
              :style="{ width: analysisData.analysis.buyScore + '%', background: scoreBarColor }"></div>
          </div>
        </div>
      </div>
    </div>

    <hr class="my-3" />

    <!-- Summary -->
    <section class="mb-4">
      <h2 class="text-sm font-semibold text-gray-700 mb-1">Summary</h2>
      <p class="text-sm text-gray-800">{{ analysisData.analysis.summary }}</p>
    </section>

    <!-- Pros & Cons -->
    <section class="flex flex-col mb-4">
      <div class="bg-green-50 p-3 rounded">
        <h3 class="text-sm font-semibold text-green-700 mb-1">Pros</h3>
        <ul class="list-disc list-inside text-sm text-gray-800">
          <li v-for="(p, i) in analysisData.analysis.pros" :key="'pro-' + i">{{ p }}</li>
          <li v-if="!analysisData.analysis.pros.length" class="text-gray-500">No pros detected</li>
        </ul>
      </div>

      <div class="bg-red-50 p-3 rounded mt-1">
        <h3 class="text-sm font-semibold text-red-700 mb-1">Cons</h3>
        <ul class="list-disc list-inside text-sm text-gray-800">
          <li v-for="(c, i) in analysisData.analysis.cons" :key="'con-' + i">{{ c }}</li>
          <li v-if="!analysisData.analysis.cons.length" class="text-gray-500">No cons detected</li>
        </ul>
      </div>
    </section>

    <!-- Hidden Issues & Alternatives -->
    <section class="mb-4">
      <h3 class="text-sm font-semibold text-gray-700">Hidden Issues</h3>
      <ul class="list-disc list-inside text-sm text-gray-800 mb-2">
        <li v-for="(h, i) in analysisData.analysis.hiddenIssues" :key="'hid-' + i">{{ h }}</li>
        <li v-if="!analysisData.analysis.hiddenIssues.length" class="text-gray-500">None found</li>
      </ul>
    </section>

    <!-- Price insight -->
    <section class="mb-4">
      <h3 class="text-sm font-semibold text-gray-700">Price Insight</h3>
      <p class="text-sm text-gray-800">{{ analysisData.analysis.priceInsight }}</p>
    </section>

    <hr class="my-3" />

    <!-- Review Summary -->
    <section class="mb-4">
      <h3 class="text-sm font-semibold text-gray-700 mb-2">Summarized Product Rating</h3>

      <div class="flex flex-col">
        <div class="bg-green-50 p-3 rounded">
          <div class="text-xs text-green-700 font-semibold mb-1">Pros</div>
          <div class="text-sm text-gray-800">
            <ul class="list-disc list-inside">
              <li v-for="(p, i) in analysisData.reviewSummary.pros" :key="'rpro-' + i">{{ p }}</li>
              <li v-if="!analysisData.reviewSummary.pros.length" class="text-gray-500">None</li>
            </ul>
          </div>
        </div>

        <div class="bg-red-50 p-3 rounded mt-2">
          <div class="text-xs text-red-700 font-semibold mb-1">Cons</div>
          <div class="text-sm text-gray-800">
            <ul class="list-disc list-inside">
              <li v-for="(c, i) in analysisData.reviewSummary.cons" :key="'rcon-' + i">{{ c }}</li>
              <li v-if="!analysisData.reviewSummary.cons.length" class="text-gray-500">None</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-3 text-sm text-gray-700">
        <span class="font-semibold">Aggregated rating:</span>
        <span class="ml-2">{{ analysisData.reviewSummary.rating }}/5</span>
      </div>
    </section>

    <hr class="my-3" />

    <!-- Similar products -->
    <section>
      <h3 class="text-sm font-semibold text-gray-700 mb-2">Similar & Recommended Products</h3>
      <ul class="space-y-2 max-h-40 overflow-auto">
        <li v-for="(s, i) in analysisData.similar" :key="'sim-' + i" class="p-2 rounded hover:bg-gray-50">
          <a :href="s.url" target="_blank" class="flex items-start gap-3">
            <div class="flex-1">
              <div class="text-sm font-semibold text-gray-800">{{ s.title || s.description || 'Unknown' }}</div>
              <div class="text-xs text-gray-500 mt-0.5">{{ s.price || '' }}</div>
              <div v-if="s.description" class="text-xs text-gray-600 mt-1">{{ s.description }}</div>
            </div>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";

// const sample = {
//   analysis: {
//     summary:
//       "Deeply discounted men’s waterproof/hiker-style boots with solid reviews but unclear branding due to mixed product info.",
//     pros: [
//       "Very low price at $19.99",
//       "High original MSRP ($210) implies strong value if authentic",
//       "4.2 rating across 500+ reviews",
//       "Waterproof/hiker design suitable for varied weather"
//     ],
//     cons: [
//       "Brand confusion between Timberland and Weatherproof Vintage",
//       "Possible mismatch between title and actual product",
//       "Deep discount may indicate limited sizes, colors, or overstock"
//     ],
//     hiddenIssues: [
//       "Potential listing error due to conflicting product names",
//       "Authenticity or model accuracy needs verification",
//       "Return policy and warranty unclear"
//     ],
//     alternatives: [
//       "Levi's hiking or work boots",
//       "Timberland official 6-inch Premium Boots directly from Timberland",
//       "Weatherproof Vintage Jace Hiker Boots from verified retailers"
//     ],
//     priceInsight:
//       "A 75% discount down to $19.99 is unusually low for any boot originally listed at $210, strongly suggesting clearance or last-season inventory. Good value if the product details are confirmed.",
//     buyScore: 78
//   },
//   reviewSummary: {
//     pros: [],
//     cons: [],
//     rating: 0
//   },
//   similar: [
//     {
//       description:
//         "Women's Casual Classic Mid Rise Bootcut Jeans",
//       price: "$41.65",
//       title: "Levi's",
//       url: "https://www.macys.com/shop/product/levis-womens-casual-classic-mid-rise-bootcut-jeans?ID=5085731&swatchColor=Island%20Rinse"
//     },
//     {
//       description: "",
//       price: "",
//       title: "AI Sidebar Widget",
//       url: "chrome-extension://mfchgdpmkaikidbppjajegpphpehainc/index.html"
//     }
//   ]
// };

// accept prop if parent passes it
// usage: <AnalysisCard :analysisData="apiResponse" />
const props = defineProps({
  analysisData: {
    type: Object,
    default: null
  }
});


// computed for color class based on buyScore
const scoreColorClass = computed(() => {
  const s = props.analysisData.analysis.buyScore || 0;
  if (s <= 40) return "bg-red-500";
  if (s <= 70) return "bg-yellow-500 text-black";
  return "bg-green-500";
});

// inline bar color
const scoreBarColor = computed(() => {
  const s = props.analysisData.analysis.buyScore || 0;
  if (s <= 40) return "#ef4444"; // red-500
  if (s <= 70) return "#f59e0b"; // yellow-500
  return "#10b981"; // green-500
});
</script>

<style scoped>
/* small scrollbar styling */
ul::-webkit-scrollbar {
  width: 6px;
}

ul::-webkit-scrollbar-thumb {
  background-color: rgba(107, 114, 128, 0.4);
  border-radius: 3px;
}
</style>