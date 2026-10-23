"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Theme = "dark" | "light";

const EXAMPLES = [
  {
    name: "IndexError",
    code: "numbers = [10, 20, 30]\nprint(numbers[3])",
    error: "IndexError: list index out of range",
  },
  {
    name: "TypeError",
    code: 'age = "20"\nprint(age + 5)',
    error: "TypeError: can only concatenate str (not 'int') to str",
  },
  {
    name: "NameError",
    code: "total = 10\nprint(totl)",
    error: "NameError: name 'totl' is not defined",
  },
];

export default function Home() {
  const [code, setCode] = useState(EXAMPLES[0].code);
  const [error, setError] = useState(EXAMPLES[0].error);
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState<Theme>("dark");
  const [themeReady, setThemeReady] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("traceback-theme");
      if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    } catch {
      // The app still works if browser storage is unavailable.
    }
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;
    try {
      window.localStorage.setItem("traceback-theme", theme);
    } catch {
      // Ignore storage restrictions; the selected theme still works for this visit.
    }
  }, [theme, themeReady]);

  async function diagnose() {
    setLoading(true);
    setDiagnosis("");
    setMessage("");
    setCopied(false);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, error, language: "python" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Diagnosis failed. Please try again.");
      setDiagnosis(result.diagnosis);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyDiagnosis() {
    try {
      await navigator.clipboard.writeText(diagnosis);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setMessage("Could not access the clipboard. Select and copy the report manually.");
    }
  }

  function selectExample(example: (typeof EXAMPLES)[number]) {
    setCode(example.code);
    setError(example.error);
    setDiagnosis("");
    setMessage("");
    setCopied(false);
  }

  return (
    <main className={`shell ${theme === "light" ? "theme-light" : "theme-dark"}`}>
      <nav className="nav">
        <a className="brand" href="#top" aria-label="TraceBack AI home">
          TraceBack<span>AI</span>
        </a>
        <div className="navActions">
          <span className="pill">OPEN-SOURCE AI</span>
          <button
            type="button"
            className="themeToggle"
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>
        </div>
      </nav>

      <section className="hero" id="top">
        <p className="eyebrow">YOUR PERSONAL DEBUGGING MENTOR</p>
        <h1>Every error has a <span>reason.</span></h1>
        <p className="subtitle">
          Find the root cause, understand the mistake, and learn how to prevent it next time.
        </p>
      </section>

      <section className="workspace" aria-label="Debugging workspace">
        <div className="panel">
          <div className="panelTitle"><span>01 / YOUR CODE</span><span>PYTHON</span></div>
          <textarea
            aria-label="Python source code"
            spellCheck={false}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="Paste your Python code here..."
          />
          <label className="fieldLabel" htmlFor="error">ERROR MESSAGE / TRACEBACK</label>
          <textarea
            id="error"
            className="errorInput"
            spellCheck={false}
            value={error}
            onChange={(event) => setError(event.target.value)}
            placeholder="Paste the error message (optional)"
          />
          <button className="primary" onClick={diagnose} disabled={loading || !code.trim()}>
            {loading ? <><span className="spinner" aria-hidden="true" /> Analysing your code...</> : "Diagnose my code →"}
          </button>
          <p className="hint">
            Your code is sent to the configured AI service for analysis. It is not executed by this application.
          </p>
          {message && <p className="errorText formMessage" role="alert">{message}</p>}
        </div>

        <div className="panel resultPanel">
          <div className="panelTitle"><span>02 / ROOT-CAUSE REPORT</span><span>AI ANALYSIS</span></div>
          {diagnosis ? (
            <>
              <article className="report markdownReport">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{diagnosis}</ReactMarkdown>
              </article>
              <button className="secondary" onClick={copyDiagnosis}>
                {copied ? "✓ Copied" : "Copy diagnosis"}
              </button>
              {message && <p className="errorText hint" role="alert">{message}</p>}
            </>
          ) : (
            <div className="empty">
              <div className="symbol" aria-hidden="true">⌘</div>
              <h2>{loading ? "Finding the root cause…" : "Your explanation starts here."}</h2>
              <p>
                {loading
                  ? "Reviewing the code and preparing a beginner-friendly explanation, a minimal fix, and a regression test."
                  : "Submit a bug to receive a root-cause analysis, a minimal fix, and a regression test."}
              </p>
              {!loading && <div className="reportSteps"><span>01 Diagnose</span><span>02 Explain</span><span>03 Prevent</span></div>}
            </div>
          )}
        </div>
      </section>

      <section className="examples">
        <p className="eyebrow">TRY A SAMPLE BUG</p>
        <div className="exampleList">
          {EXAMPLES.map((example) => (
            <button key={example.name} className="example" onClick={() => selectExample(example)}>
              {example.name}<span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </section>

      <footer>
        <span>Built for learners</span><span className="footerDot">·</span><span>Open source</span><span className="footerDot">·</span><span>Debug smarter, learn faster</span>
      </footer>
    </main>
  );
}
