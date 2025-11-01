"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import MDEditor from '@uiw/react-md-editor';
import EmojiPicker, { EmojiClickData, Theme, EmojiStyle } from 'emoji-picker-react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Smile,
  Type,
  Eye,
  EyeOff,
  Palette
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Digite a descrição do evento...",
  maxLength = 500,
  className = ""
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [emojiButtonRect, setEmojiButtonRect] = useState<DOMRect | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.slice(0, start) + emojiData.emoji + value.slice(end);
      onChange(newValue);
      
      // Manter o cursor na posição correta após inserir o emoji
      setTimeout(() => {
        const newPosition = start + emojiData.emoji.length;
        textarea.setSelectionRange(newPosition, newPosition);
        textarea.focus();
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    if (!showEmojiPicker && emojiButtonRef.current) {
      const rect = emojiButtonRef.current.getBoundingClientRect();
      setEmojiButtonRect(rect);
    }
    setShowEmojiPicker(!showEmojiPicker);
  };

  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.slice(start, end);
      const newText = before + selectedText + after;
      const newValue = value.slice(0, start) + newText + value.slice(end);
      onChange(newValue);
      
      setTimeout(() => {
        const newStart = start + before.length;
        const newEnd = newStart + selectedText.length;
        textarea.setSelectionRange(newStart, newEnd);
        textarea.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const lines = value.substring(0, start).split('\n');
        const currentLine = lines[lines.length - 1];
        
        // Verifica se a linha atual é uma lista com marcador (-) vazia
        const bulletMatch = currentLine.match(/^(\s*)-\s*$/);
        if (bulletMatch) {
          // Se a linha só tem o marcador sem texto, remove ela e sai da lista
          e.preventDefault();
          const lineStart = value.lastIndexOf('\n', start - 1) + 1;
          const newValue = value.slice(0, lineStart) + value.slice(start);
          onChange(newValue);
          
          setTimeout(() => {
            textarea.setSelectionRange(lineStart, lineStart);
            textarea.focus();
          }, 0);
          return;
        }
        
        // Verifica se a linha atual é uma lista com marcador (-) com conteúdo
        const bulletContentMatch = currentLine.match(/^(\s*)-\s+(.+)/);
        if (bulletContentMatch) {
          e.preventDefault();
          const indent = bulletContentMatch[1];
          const newValue = value.slice(0, start) + '\n' + indent + '- ' + value.slice(start);
          onChange(newValue);
          
          setTimeout(() => {
            const newPosition = start + indent.length + 3; // \n + indent + "- "
            textarea.setSelectionRange(newPosition, newPosition);
            textarea.focus();
          }, 0);
          return;
        }
        
        // Verifica se a linha atual é uma lista numerada vazia
        const numberedEmptyMatch = currentLine.match(/^(\s*)(\d+)\.\s*$/);
        if (numberedEmptyMatch) {
          // Se a linha só tem o número sem texto, remove ela e sai da lista
          e.preventDefault();
          const lineStart = value.lastIndexOf('\n', start - 1) + 1;
          const newValue = value.slice(0, lineStart) + value.slice(start);
          onChange(newValue);
          
          setTimeout(() => {
            textarea.setSelectionRange(lineStart, lineStart);
            textarea.focus();
          }, 0);
          return;
        }
        
        // Verifica se a linha atual é uma lista numerada com conteúdo
        const numberedMatch = currentLine.match(/^(\s*)(\d+)\.\s+(.+)/);
        if (numberedMatch) {
          e.preventDefault();
          const indent = numberedMatch[1];
          const nextNumber = parseInt(numberedMatch[2]) + 1;
          const newValue = value.slice(0, start) + '\n' + indent + nextNumber + '. ' + value.slice(start);
          onChange(newValue);
          
          setTimeout(() => {
            const newPosition = start + indent.length + nextNumber.toString().length + 3; // \n + indent + number + ". "
            textarea.setSelectionRange(newPosition, newPosition);
            textarea.focus();
          }, 0);
          return;
        }
      }
    }
  };

  const formatButtons = [
    {
      icon: Bold,
      label: "Negrito",
      action: () => insertText("**", "**"),
      shortcut: "Ctrl+B"
    },
    {
      icon: Italic,
      label: "Itálico",
      action: () => insertText("*", "*"),
      shortcut: "Ctrl+I"
    },
    {
      icon: Underline,
      label: "Sublinhado",
      action: () => insertText("<u>", "</u>"),
      shortcut: "Ctrl+U"
    },
    {
      icon: List,
      label: "Lista",
      action: () => insertText("- "),
      shortcut: ""
    },
    {
      icon: ListOrdered,
      label: "Lista Numerada",
      action: () => insertText("1. "),
      shortcut: ""
    },
    {
      icon: Link,
      label: "Link",
      action: () => insertText("[", "](url)"),
      shortcut: ""
    }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3 p-3 bg-slate-800/30 border border-slate-600 rounded-t-xl backdrop-blur-sm">
        <div className="flex items-center gap-1">
          {formatButtons.map((button, index) => {
            const IconComponent = button.icon;
            return (
              <button
                key={index}
                type="button"
                onClick={button.action}
                title={`${button.label} ${button.shortcut}`}
                className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-orange-400 transition-all duration-200"
              >
                <IconComponent className="h-4 w-4" />
              </button>
            );
          })}
          
          <div className="w-px h-6 bg-slate-600 mx-2" />
          
          {/* Emoji Picker Button */}
          <div className="relative">
            <button
              ref={emojiButtonRef}
              type="button"
              onClick={toggleEmojiPicker}
              title="Inserir Emoji"
              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-orange-400 transition-all duration-200"
            >
              <Smile className="h-4 w-4" />
            </button>
            

          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview Toggle */}
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            title="Alternar Visualização"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-700/50 text-slate-300 hover:text-orange-400 transition-all duration-200"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="text-xs">{showPreview ? "Editor" : "Preview"}</span>
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      {showPreview ? (
        <div className="min-h-[200px] p-4 bg-slate-800/50 border border-slate-600 rounded-b-xl border-t-0 rich-editor max-w-none">
          <div 
            className="text-white [&>ul]:my-1 [&>ol]:my-1 [&>li]:my-0.5 [&>li]:leading-tight"
            dangerouslySetInnerHTML={{ 
              __html: value
                .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #f97316; font-weight: 600;">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em style="color: #fbbf24; font-style: italic;">$1</em>')
                .replace(/<u>(.*?)<\/u>/g, '<u style="text-decoration: underline;">$1</u>')
                .replace(/^- (.*$)/gm, '<li style="margin: 0.125rem 0; line-height: 1.3;">• $1</li>')
                .replace(/^(\d+)\. (.*$)/gm, '<li style="margin: 0.125rem 0; line-height: 1.3;">$1. $2</li>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #f97316; text-decoration: underline;" class="hover:text-orange-300">$1</a>')
                .replace(/\n/g, '<br>')
            }} 
          />
        </div>
      ) : (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            className="w-full min-h-[200px] p-4 bg-slate-800/50 border border-slate-600 rounded-b-xl border-t-0 text-white placeholder-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 backdrop-blur-sm transition-all duration-200 resize-none focus:outline-none"
            style={{ fontSize: '14px', lineHeight: '1.4' }}
          />
          
          {/* Character Counter */}
          <div className="absolute bottom-3 right-3 text-xs text-slate-500">
            {value.length}/{maxLength}
          </div>
        </div>
      )}

      {/* Format Guide */}
      <div className="mt-2 p-3 bg-slate-900/30 border border-slate-700 rounded-md">
        <p className="text-xs text-slate-400 mb-2">💡 Dicas de formatação:</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
          <div>**negrito** = <strong className="text-white">negrito</strong></div>
          <div>*itálico* = <em className="text-white">itálico</em></div>
          <div>&lt;u&gt;sublinhado&lt;/u&gt; = <u className="text-white">sublinhado</u></div>
          <div>- item = • item</div>
          <div>1. item = 1. item</div>
          <div>[texto](url) = <span className="text-orange-400">link</span></div>
        </div>
      </div>

      {/* Emoji Picker Portal */}
      {showEmojiPicker && emojiButtonRect && typeof window !== 'undefined' && createPortal(
        <>
          {/* Click outside to close emoji picker */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setShowEmojiPicker(false)}
          />
          {/* Emoji Picker */}
          <div 
            className="fixed z-[9999] shadow-2xl"
            style={{
              top: emojiButtonRect.bottom + window.scrollY + 8,
              left: Math.max(10, Math.min(emojiButtonRect.left + window.scrollX - 160, window.innerWidth - 330)),
              maxWidth: '320px'
            }}
          >
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme={Theme.DARK}
              emojiStyle={EmojiStyle.NATIVE}
              width={320}
              height={380}
            />
          </div>
        </>,
        document.body
      )}
    </div>
  );
};