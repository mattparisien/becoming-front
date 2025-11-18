'use client';

import { useState } from 'react';
import classNames from 'classnames';

interface CodeBlockProps {
    value: {
        code?: string;
        language?: string;
        filename?: string;
    };
}

export default function CodeBlock({ value }: CodeBlockProps) {
    const { code, language, filename } = value || {};
    const [copied, setCopied] = useState(false);
    
    const handleCopy = async () => {
        if (!code) return;
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };
    
    return (
        <div className="my-6 rounded-lg overflow-hidden border border-foreground/10 relative group">
            {filename && (
                <div className="bg-foreground/5 px-4 py-2 text-sm font-mono text-foreground/70 border-b border-foreground/10">
                    {filename}
                </div>
            )}
            <button
                onClick={handleCopy}
                className="cursor-pointer absolute top-2 right-2 p-1.5 rounded bg-foreground/10 hover:bg-foreground/15 border border-foreground/20 transition-colors"
                aria-label="Copy code"
                title={copied ? 'Copied!' : 'Copy code'}
            >
                {copied ? (
                    <svg className="w-3.5 h-3.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-3.5 h-3.5 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                )}
            </button>
            <div className="bg-foreground/[0.04] text-foreground/70 p-4 overflow-x-auto">
                <pre className="text-xs">
                    <code className={classNames('font-mono', language && `language-${language}`)}>
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
}
