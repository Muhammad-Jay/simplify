import React, { useState } from "react";

export default function CodePreview({ files }: { files: Record<string, string> }) {
    const [copiedFile, setCopiedFile] = useState<string | null>(null);

    const copyToClipboard = async (code: string, filename: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedFile(filename);
            setTimeout(() => setCopiedFile(null), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="space-y-6">
            {Object.entries(files).map(([filename, code]) => (
                <div key={filename} className="relative bg-gray-100 p-4 rounded shadow">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-gray-700">{filename}</h3>
                        <button
                            onClick={() => copyToClipboard(code, filename)}
                            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                        >
                            {copiedFile === filename ? "✅ Copied!" : "📋 Copy"}
                        </button>
                    </div>
                    <pre className="overflow-x-auto bg-white p-3 rounded text-sm">
            <code className="text-gray-800 whitespace-pre-wrap">
              {code}
            </code>
          </pre>
                </div>
            ))}
        </div>
    );
}
