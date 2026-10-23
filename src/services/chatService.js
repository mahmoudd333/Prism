const temporaryReplies = [
  "Thanks for your question! I'm a demo assistant for now. Once the AI model is connected, I'll be able to give you more accurate answers.",
  "That's a great question! Soon, I'll be able to answer using the store's FAQs, policies, and product information.",
  "I'd be happy to help! The real AI assistant will be connected here later.",
];

export async function sendMessageToAI(message) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("shipping")) {
    return "I can help with shipping questions! Shipping information will be available once the store's knowledge base is connected.";
  }

  if (
    normalizedMessage.includes("return") ||
    normalizedMessage.includes("refund")
  ) {
    return "I can help with returns and refunds! The store's actual return policy will be available when the knowledge base is connected.";
  }

  if (
    normalizedMessage.includes("product") ||
    normalizedMessage.includes("price")
  ) {
    return "Ask me about a product! I'll be able to look up real product details after the knowledge base is connected.";
  }

  const index = Math.floor(Math.random() * temporaryReplies.length);

  return temporaryReplies[index];
}
