# TraceBack AI — Your Personal Debugging Mentor

TraceBack AI is an open-source AI debugging assistant for learners. It analyzes Python code and error messages, explains the likely root cause, suggests a minimal fix, and proposes a regression test.

## Features
- Beginner-friendly root-cause analysis
- Minimal corrected-code suggestions
- Regression test generation
- Sample Python bugs
- Next.js server-side model API route

## Requirements
- Node.js 20.9 or later
- Ollama local install, or an accessible hosted Ollama API endpoint and API key

## Run locally
```bash
npm install
cp .env.example .env.local
```
Edit `.env.local` for your actual model endpoint and model name, then:
```bash
npm run dev
```
Open http://localhost:3000.

For local Ollama, start Ollama and pull a model supported by your machine, for example:
```bash
ollama pull gemma3:4b
```
Ensure the `OLLAMA_MODEL` value matches the installed model. For hosted inference, configure the provider's documented HTTPS API endpoint and secret key. Do not expose keys in client-side variables.

## Deployment
Deploy to Vercel or another Next.js-compatible host. Add `OLLAMA_BASE_URL`, `OLLAMA_MODEL`, and (when needed) `OLLAMA_API_KEY` in the host's server-side environment settings. A laptop-only localhost endpoint will not work from a public deployment. Test an actual diagnosis on the deployed URL.

## Safety
Submitted code and error messages are sent to the configured model provider. This app does not execute submitted code. Review AI-generated suggestions before use.

## AI tools and acknowledgments
Update this section to accurately list the AI coding assistants and model providers actually used to build and test this project.

## License
MIT
