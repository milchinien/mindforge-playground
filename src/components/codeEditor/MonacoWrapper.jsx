import Editor from '@monaco-editor/react'

const FILE_TABS = [
  { id: 'html', label: 'index.html', language: 'html' },
  { id: 'css', label: 'style.css', language: 'css' },
  { id: 'js', label: 'script.js', language: 'javascript' },
]

export default function MonacoWrapper({ code, activeFile, onFileChange, onCodeChange }) {
  const activeTab = FILE_TABS.find(t => t.id === activeFile) || FILE_TABS[0]

  return (
    <div className="flex flex-col h-full">
      {/* File Tabs */}
      <div className="flex bg-[#1e1e1e] border-b border-[#333]">
        {FILE_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => onFileChange(tab.id)}
            className={`px-4 py-2 text-xs font-mono transition-colors cursor-pointer ${
              activeFile === tab.id
                ? 'bg-[#1e1e1e] text-white border-t-2 border-t-accent'
                : 'bg-[#2d2d2d] text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={activeTab.language}
          value={code[activeFile] || ''}
          onChange={(value) => onCodeChange(activeFile, value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  )
}
