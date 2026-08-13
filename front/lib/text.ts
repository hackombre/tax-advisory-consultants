/**
 * Replaces non-breaking spaces (U+00A0), often introduced when pasting text
 * copied from Word or Google Docs, with normal spaces. Left unchecked, a run
 * of non-breaking spaces prevents the browser from wrapping a long sentence,
 * which pushes the whole page into horizontal overflow.
 */
export function normalizeSpaces(text: string | undefined): string | undefined {
  if (!text) return text;
  return text.replace(/\u00a0/g, " ");
}
