import { nanoid } from 'nanoid';

// Function to generate API key
export function generateAPIKey(): string {
    const apiKeyLength = 32; // Adjust the length of the API key as needed
    const apiKey = nanoid(apiKeyLength);
    return apiKey;
}

// Function to generate API key prefix
export function generatePrefix(): string {
    const prefixLength = 8; // Adjust the length of the API key as needed
    const prefix = nanoid(prefixLength);
    return prefix;
}


