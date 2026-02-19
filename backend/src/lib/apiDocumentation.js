/**
 * @file apiDocumentation.js
 * @description Centralized API documentation constants and structures.
 * This serves as a source for swagger generation or frontend documentation pages.
 */

const API_DOCS = {
    version: "2.0.0",
    title: "Synapse Synchrony API",
    description: "The core backend API for the IUT student collaborative platform.",
    base_url: "http://localhost:5000/api",
    auth: {
        types: ["JWT", "Session"],
        endpoints: {
            login: { method: "POST", path: "/auth/login", params: ["email", "password"] },
            register: { method: "POST", path: "/auth/register", params: ["userId", "name", "email", "password"] },
            verify: { method: "GET", path: "/auth/verify/:token" }
        }
    },
    resources: {
        blogs: {
            description: "Community blog posts and academic articles.",
            endpoints: [
                { path: "/blogs", method: "GET", description: "Get list of blogs with pagination", query_params: ["page", "limit", "category", "search"] },
                { path: "/blogs/:id", method: "GET", description: "Get single blog detail" },
                { path: "/blogs", method: "POST", description: "Create new blog (Auth required)" },
                { path: "/blogs/:id/like", method: "POST", description: "Like/Unlike a blog" }
            ]
        },
        events: {
            description: "Campus events, seminars, and workshops.",
            endpoints: [
                { path: "/events", method: "GET", description: "Get all upcoming events" },
                { path: "/events/:id/register", method: "POST", description: "Register for an event" }
            ]
        },
        wellness: {
            description: "Personal wellness tracking logs.",
            endpoints: [
                { path: "/wellness/mood", method: "POST", description: "Log daily mood" },
                { path: "/wellness/stress", method: "POST", description: "Log current stress level" },
                { path: "/wellness/summary", method: "GET", description: "Get monthly wellness analytics" }
            ]
        },
        medilink: {
            description: "AI-driven health diagnosis and medical support.",
            endpoints: [
                { path: "/medilink/diagnose", method: "POST", description: "Get AI diagnosis based on symptoms" }
            ]
        }
    },
    error_codes: {
        400: "Bad Request - Invalid input data",
        401: "Unauthorized - Authentication failed",
        403: "Forbidden - Permission denied",
        404: "Not Found - Resource does not exist",
        429: "Too Many Requests - Rate limit exceeded",
        500: "Internal Server Error"
    }
};

/**
 * Generates a markdown representation of the API documentation
 */
function generateMarkdownDocs() {
    let md = `# ${API_DOCS.title}\n\n`;
    md += `${API_DOCS.description}\n\n`;
    md += `**Base URL:** \`${API_DOCS.base_url}\`\n\n`;

    Object.keys(API_DOCS.resources).forEach(key => {
        const resource = API_DOCS.resources[key];
        md += `## ${key.toUpperCase()}\n`;
        md += `${resource.description}\n\n`;
        md += `| Method | Path | Description |\n`;
        md += `| --- | --- | --- |\n`;
        resource.endpoints.forEach(ep => {
            md += `| \`${ep.method}\` | \`${ep.path}\` | ${ep.description} |\n`;
        });
        md += `\n`;
    });

    return md;
}

module.exports = { API_DOCS, generateMarkdownDocs };
