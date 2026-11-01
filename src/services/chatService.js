const API_URL = "http://localhost:5000";

export async function sendMessageToAI(message, conversationId) {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: message,
      conversationId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to get a response.");
  }

  return data;
}

export async function getNewConversationMessages(conversationId, after) {
  const params = new URLSearchParams();

  if (after) {
    params.set("after", after);
  }

  const response = await fetch(
    `${API_URL}/api/conversations/${encodeURIComponent(conversationId)}/messages?${params}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to retrieve messages.");
  }

  return data.messages || [];
}

export async function getAdminConversations(token, unanswered = false) {
  const endpoint = unanswered
    ? "/api/conversations/unanswered"
    : "/api/conversations";

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load conversations.");
  }

  return data.conversations || [];
}

export async function getAdminConversation(token, conversationId) {
  const response = await fetch(
    `${API_URL}/api/conversations/${encodeURIComponent(conversationId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to load conversation.");
  }

  return data.conversation;
}

export async function sendAdminReply(token, conversationId, text) {
  const response = await fetch(
    `${API_URL}/api/conversations/${encodeURIComponent(conversationId)}/reply`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to send reply.");
  }

  return data.conversation;
}

export async function updateConversationStatus(token, conversationId, status) {
  const response = await fetch(
    `${API_URL}/api/conversations/${encodeURIComponent(conversationId)}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to update status.");
  }

  return data.conversation;
}
export async function getCommonQuestions(token) {
  const response = await fetch(
    `${API_URL}/api/analytics/common-questions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to load common questions."
    );
  }

  return data.questions || [];
}
