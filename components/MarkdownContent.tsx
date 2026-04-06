"use client";

interface Props {
  content: string;
}

function renderMarkdown(text: string): string {
  return text
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    // Bold/italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr />')
    // Checkboxes
    .replace(/^- \[ \] (.+)$/gm, '<li class="flex gap-2 items-start"><input type="checkbox" disabled class="mt-1 shrink-0" /><span>$1</span></li>')
    .replace(/^- \[x\] (.+)$/gm, '<li class="flex gap-2 items-start"><input type="checkbox" checked disabled class="mt-1 shrink-0" /><span>$1</span></li>')
    // Unordered list items
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^\* (.+)$/gm, '<li>$1</li>')
    // Ordered list items
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Wrap consecutive li in ul/ol
    .replace(/(<li>[\s\S]*?<\/li>)(\n(?!<li>)|$)/g, (match) => `<ul>${match}</ul>`)
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Paragraphs (lines not already wrapped)
    .split('\n\n')
    .map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<h') || block.startsWith('<ul') || block.startsWith('<ol') || block.startsWith('<hr') || block.startsWith('<li')) return block;
      return `<p>${block.replace(/\n/g, '<br />')}</p>`;
    })
    .join('\n');
}

export default function MarkdownContent({ content }: Props) {
  return (
    <div
      className="prose text-slate-700 text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
    />
  );
}
