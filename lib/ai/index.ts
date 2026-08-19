import * as openai from './openai'
import * as gemini from './gemini'

const provider = process.env.LLM_PROVIDER

const aiProvider = provider === 'openai' ? openai : gemini;

export const generateChatResponse = aiProvider.generateChatResponse;
export const generateTitle = aiProvider.generateTitle;
export const generateCompletion = aiProvider.generateCompletion;

// Model handles for callers that need to pass tools or schemas.
export const chatModel = aiProvider.chatModel;
export const visionModel = aiProvider.visionModel;
export const utilityModel = aiProvider.utilityModel;

// Embeddings are pinned to OpenAI regardless of LLM_PROVIDER.
//
// The Pinecone index is 1536-dimensional (text-embedding-3-small). Gemini's
// embedding-001 is 768-d, so under LLM_PROVIDER=gemini every Pinecone query
// threw and retrieveContext() swallowed it — RAG silently returned nothing.
// Pinning here keeps the provider swap honest about what it actually swaps.
export const embedQuery = openai.embedQuery;
