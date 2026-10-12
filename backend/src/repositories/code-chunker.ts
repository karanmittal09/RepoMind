export interface CodeChunkData {
  content: string;
  startLine: number;
  endLine: number;
  chunkIndex: number;
}

export function chunkCode(
  content: string,
  maxLines = 80,
  overlapLines = 10,
): CodeChunkData[] {
  if (overlapLines >= maxLines || overlapLines < 0) {
    throw new Error('Overlap must be smaller than chunk size');
  }

  const lines = content.split(/\r?\n/);
  const chunks: CodeChunkData[] = [];
  const step = maxLines - overlapLines;

  for (let start = 0; start < lines.length; start += step) {
    const end = Math.min(start + maxLines, lines.length);
    const chunkContent = lines.slice(start, end).join('\n');

    if (chunkContent.trim()) {
      chunks.push({
        content: chunkContent,
        startLine: start + 1,
        endLine: end,
        chunkIndex: chunks.length,
      });
    }

    if (end === lines.length) {
      break;
    }
  }

  return chunks;
}