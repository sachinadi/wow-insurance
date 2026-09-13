import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-5";

export type ChatMessage = { role: "user" | "assistant"; content: string };

function buildSystemPrompt(
  role: "admin" | "enduser",
  contextData: unknown
): string {
  const dataBlock = JSON.stringify(contextData, null, 2);

  if (role === "admin") {
    return `You are the WOW Insurance portfolio assistant, helping an insurance administrator.
You have access to the full portfolio data below (all policies, claims, and products). Use ONLY this data to answer questions — never invent records that aren't present.
You can help the admin find specific records (e.g. filter by customer, status, or date), summarize trends, and give operational recommendations (e.g. flag overdue or high-value claims, suggest which customers may need follow-up, highlight lapsing policies).
Keep answers concise and use bullet points or short tables where helpful.

PORTFOLIO DATA:
${dataBlock}`;
  }

  return `You are the WOW Insurance personal assistant, helping an individual policyholder understand their own coverage.
You have access to this customer's own data below (their policies, claims, and general FAQs). Use ONLY this data to answer questions — never invent facts not present here, and never reference other customers.
You can help them look up their policy number, coverage amount, and claim status, and offer general recommendations (e.g. when to consider more coverage, how their claim history looks, relevant FAQ answers).
Keep answers concise and friendly.

CUSTOMER DATA:
${dataBlock}`;
}

export async function askAssistant({
  role,
  contextData,
  message,
  history,
}: {
  role: "admin" | "enduser";
  contextData: unknown;
  message: string;
  history: ChatMessage[];
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return "The assistant isn't configured yet — add ANTHROPIC_API_KEY to enable it.";
  }

  const workspaceId = process.env.ANTHROPIC_WORKSPACE_ID;
  const client = new Anthropic({
    apiKey,
    defaultHeaders: workspaceId ? { "anthropic-workspace-id": workspaceId } : undefined,
  });

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: buildSystemPrompt(role, contextData),
    messages: [...history, { role: "user", content: message }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text"
    ? textBlock.text
    : "Sorry, I couldn't generate a response just now.";
}
