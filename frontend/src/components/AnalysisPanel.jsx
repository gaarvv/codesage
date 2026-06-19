import { useState } from 'react'

function ScoreColor(score) {
  if (score >= 7) return 'score-high'
  if (score >= 4) return 'score-mid'
  return 'score-low'
}

function ComplexityColor(notation) {
  if (!notation) return 'cx-n'
  if (notation.includes('n²') || notation.includes('n^2') || notation.includes('n*n')) return 'cx-n2'
  if (notation.includes('2^') || notation.includes('n!')) return 'cx-exp'
  return 'cx-n'
}

function ReviewResult({ data }) {
  return (
    <div className="ap-content">
      {/* Score + summary */}
      <div className="ap-score-row">
        <div className={`ap-score-badge ${ScoreColor(data.quality_score)}`}>
          {data.quality_score || '?'}/10
        </div>
        <p className="ap-summary">{data.summary}</p>
      </div>

      {/* Bugs */}
      {data.bugs?.length > 0 && (
        <div className="ap-card">
          <div className="ap-card-header">🐛 Bugs ({data.bugs.length})</div>
          <div className="ap-card-body">
            {data.bugs.map((bug, i) => (
              <div key={i} className={`bug-item ${bug.severity}`}>
                <div className="bug-meta">
                  {bug.line && <span className="bug-line">Line {bug.line}</span>}
                  <span className={`bug-sev sev-${bug.severity}`}>{bug.severity}</span>
                </div>
                <div className="bug-issue">{bug.issue}</div>
                {bug.fix && (
                  <div className="bug-fix">
                    <span className="bug-fix-label">Fix: </span>{bug.fix}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {data.suggestions?.length > 0 && (
        <div className="ap-card">
          <div className="ap-card-header">💡 Suggestions ({data.suggestions.length})</div>
          <div className="ap-card-body">
            {data.suggestions.map((s, i) => (
              <div key={i} className="suggestion-item">
                <div className="sug-type">{s.type}</div>
                <div className="sug-text">{s.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complexity */}
      {data.complexity && (
        <div className="ap-card">
          <div className="ap-card-header">⚡ Complexity</div>
          <div className="ap-card-body">
            <div className="complexity-grid">
              <div className="cx-box">
                <div className="cx-label">Time</div>
                <div className={`cx-val ${ComplexityColor(data.complexity.time)}`}>
                  {data.complexity.time || '—'}
                </div>
              </div>
              <div className="cx-box">
                <div className="cx-label">Space</div>
                <div className={`cx-val ${ComplexityColor(data.complexity.space)}`}>
                  {data.complexity.space || '—'}
                </div>
              </div>
            </div>
            {data.complexity.explanation && (
              <p className="cx-explain">{data.complexity.explanation}</p>
            )}
          </div>
        </div>
      )}

      {/* Positives */}
      {data.positives?.length > 0 && (
        <div className="ap-card">
          <div className="ap-card-header">✅ What's Good</div>
          <div className="ap-card-body">
            <div className="positive-list">
              {data.positives.map((p, i) => (
                <div key={i} className="positive-item">{p}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ExplainResult({ data }) {
  return (
    <div className="ap-content">
      <div className="ap-card">
        <div className="ap-card-header">📋 Overview</div>
        <div className="ap-card-body">
          <p className="ap-summary">{data.overview}</p>
        </div>
      </div>

      {data.breakdown?.length > 0 && (
        <div className="ap-card">
          <div className="ap-card-header">📝 Line-by-Line</div>
          <div className="ap-card-body">
            {data.breakdown.map((b, i) => (
              <div key={i} className="breakdown-item">
                <span className="breakdown-lines">{b.lines}</span>
                <span className="breakdown-text">{b.explanation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.key_concepts?.length > 0 && (
        <div className="ap-card">
          <div className="ap-card-header">🔑 Key Concepts</div>
          <div className="ap-card-body">
            <div className="concept-pills">
              {data.key_concepts.map((c, i) => (
                <span key={i} className="concept-pill">{c}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {data.example_use && (
        <div className="ap-card">
          <div className="ap-card-header">🚀 Example Use</div>
          <div className="ap-card-body">
            <p className="ap-summary">{data.example_use}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function ConvertResult({ data }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(data.converted_code || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="ap-content">
      {data.notes && (
        <div className="ap-card">
          <div className="ap-card-header">📌 Notes</div>
          <div className="ap-card-body">
            <p className="ap-summary">{data.notes}</p>
          </div>
        </div>
      )}
      <div className="ap-card">
        <div className="ap-card-header">💻 Converted Code</div>
        <div className="ap-card-body">
          <pre className="code-block">{data.converted_code}</pre>
          <button className="copy-btn" onClick={handleCopy}>
            {copied ? '✓ Copied!' : '📋 Copy code'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AnalysisPanel({ result, loading, error, activeAction }) {
  if (loading) {
    return (
      <div className="ap-loading">
        <div className="ap-loading-spinner" />
        <p style={{ fontSize: '13px', color: '#8b949e' }}>
          {activeAction === 'analyze' ? 'Reviewing your code…'
            : activeAction === 'explain' ? 'Explaining your code…'
            : 'Converting code…'}
        </p>
      </div>
    )
  }

  if (error) {
    return <div className="ap-error">❌ {error}</div>
  }

  if (!result) {
    return (
      <div className="ap-empty">
        <div className="ap-empty-icon">🔬</div>
        <p className="ap-empty-text">
          Paste your code in the editor, select a language, then click<br />
          <strong>Review</strong>, <strong>Explain</strong>, or <strong>Convert</strong>
        </p>
      </div>
    )
  }

  if (result.type === 'analyze') return <ReviewResult data={result.data} />
  if (result.type === 'explain') return <ExplainResult data={result.data} />
  if (result.type === 'convert') return <ConvertResult data={result.data} />
  return null
}
