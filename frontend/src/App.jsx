import { useState } from 'react'
import CodeEditor from './components/CodeEditor'
import AnalysisPanel from './components/AnalysisPanel'
import './App.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8001'

const LANGUAGES = [
  'python', 'javascript', 'typescript', 'java', 'c', 'cpp',
  'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin',
]

export default function App() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('python')
  const [result, setResult] = useState(null)
  const [activeAction, setActiveAction] = useState(null) // 'analyze'|'explain'|'convert'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [convertTo, setConvertTo] = useState('javascript')

  async function callAPI(endpoint, body) {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(`${API}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult({ type: endpoint, data })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleAnalyze() {
    if (!code.trim()) return
    setActiveAction('analyze')
    callAPI('analyze', { code, language })
  }

  function handleExplain() {
    if (!code.trim()) return
    setActiveAction('explain')
    callAPI('explain', { code, language })
  }

  function handleConvert() {
    if (!code.trim()) return
    setActiveAction('convert')
    callAPI('convert', { code, from_language: language, to_language: convertTo })
  }

  return (
    <div className="cs-layout">
      {/* Top bar */}
      <header className="cs-topbar">
        <div className="cs-brand">
          <span className="cs-brand-icon">🔬</span>
          <span className="cs-brand-name">CodeSage</span>
        </div>

        <div className="cs-controls">
          <div className="cs-select-wrap">
            <label className="cs-label">Language</label>
            <select
              className="cs-select"
              value={language}
              onChange={e => setLanguage(e.target.value)}
            >
              {LANGUAGES.map(l => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
          </div>

          <button
            className="cs-btn cs-btn-primary"
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
          >
            {loading && activeAction === 'analyze' ? <span className="cs-spin" /> : '🔍'} Review
          </button>

          <button
            className="cs-btn cs-btn-secondary"
            onClick={handleExplain}
            disabled={loading || !code.trim()}
          >
            {loading && activeAction === 'explain' ? <span className="cs-spin" /> : '📖'} Explain
          </button>

          <div className="cs-convert-group">
            <span className="cs-label">Convert to</span>
            <select
              className="cs-select cs-select-sm"
              value={convertTo}
              onChange={e => setConvertTo(e.target.value)}
            >
              {LANGUAGES.filter(l => l !== language).map(l => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
              ))}
            </select>
            <button
              className="cs-btn cs-btn-secondary"
              onClick={handleConvert}
              disabled={loading || !code.trim()}
            >
              {loading && activeAction === 'convert' ? <span className="cs-spin" /> : '🔄'} Convert
            </button>
          </div>
        </div>
      </header>

      {/* Body: editor | results */}
      <div className="cs-body">
        <div className="cs-editor-pane">
          <CodeEditor
            code={code}
            language={language}
            onChange={setCode}
          />
        </div>

        <div className="cs-result-pane">
          <AnalysisPanel
            result={result}
            loading={loading}
            error={error}
            activeAction={activeAction}
          />
        </div>
      </div>
    </div>
  )
}
