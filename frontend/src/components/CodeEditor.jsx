import Editor from '@monaco-editor/react'

const MONACO_LANG_MAP = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  csharp: 'csharp',
  go: 'go',
  rust: 'rust',
  php: 'php',
  ruby: 'ruby',
  swift: 'swift',
  kotlin: 'kotlin',
}

const EXT_MAP = {
  python: 'py',
  javascript: 'js',
  typescript: 'ts',
  java: 'java',
  c: 'c',
  cpp: 'cpp',
  csharp: 'cs',
  go: 'go',
  rust: 'rs',
  php: 'php',
  ruby: 'rb',
  swift: 'swift',
  kotlin: 'kt',
}

const DEFAULT_SNIPPETS = {
  python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

numbers = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(numbers))`,

  javascript: `function fetchUser(userId) {
  return fetch('https://api.example.com/users/' + userId)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      return data
    })
}

fetchUser(1)`,
}

export default function CodeEditor({ code, language, onChange }) {
  const monacoLang = MONACO_LANG_MAP[language] || language
  const ext = EXT_MAP[language] || language

  function handleMount(editor) {
    if (!code) {
      const snippet = DEFAULT_SNIPPETS[language] || `// Write your ${language} code here\n`
      onChange(snippet)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* File tab bar */}
      <div style={{
        padding: '8px 16px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: '12px',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: "'JetBrains Mono', 'Consolas', monospace",
      }}>
        <span style={{
          color: 'var(--text-primary)',
          fontWeight: 500,
          padding: '3px 10px',
          background: 'rgba(99, 102, 241, 0.08)',
          borderRadius: '6px',
          border: '1px solid rgba(99, 102, 241, 0.12)',
        }}>
          main.{ext}
        </span>
        <span style={{ color: 'var(--border-default)' }}>·</span>
        <span>{code.split('\n').length} lines</span>
        <span style={{ color: 'var(--border-default)' }}>·</span>
        <span>{code.length} chars</span>
      </div>

      <Editor
        height="100%"
        language={monacoLang}
        value={code}
        theme="vs-dark"
        onChange={val => onChange(val || '')}
        onMount={handleMount}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Consolas', 'Monaco', monospace",
          minimap: { enabled: false },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2,
          automaticLayout: true,
          padding: { top: 14, bottom: 14 },
          renderLineHighlight: 'line',
          smoothScrolling: true,
          cursorSmoothCaretAnimation: 'on',
          cursorBlinking: 'smooth',
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  )
}
