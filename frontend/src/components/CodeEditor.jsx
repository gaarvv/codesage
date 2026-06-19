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

  function handleMount(editor) {
    if (!code) {
      const snippet = DEFAULT_SNIPPETS[language] || `// Write your ${language} code here\n`
      onChange(snippet)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{
        padding: '6px 14px',
        background: '#161b22',
        borderBottom: '1px solid #30363d',
        fontSize: '12px',
        color: '#8b949e',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ color: '#e6edf3', fontFamily: 'monospace' }}>main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : language}</span>
        <span>·</span>
        <span>{code.split('\n').length} lines</span>
        <span>·</span>
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
          minimap: { enabled: false },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2,
          automaticLayout: true,
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: 'line',
          smoothScrolling: true,
        }}
      />
    </div>
  )
}
