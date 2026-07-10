# Usage

## 1. Install

```bash
pnpm add @react-pdf/renderer
```

No Puppeteer, no Chromium — pure JS, works fine in the browser and in Vercel serverless if you
ever want to move generation server-side later.

## 2. Copy these files into your project

```
lib/pdf/markdownParser.ts
components/pdf/BlockRenderer.tsx
components/pdf/PRDTemplate.tsx
components/pdf/PitchDeckTemplate.tsx
components/pdf/DownloadPDFButton.tsx
```

Adjust the `@/lib/pdf/...` and `@/components/pdf/...` import paths if your `tsconfig.json`
path alias differs from the Next.js default.

## 3. PRD page usage

```tsx
import { DownloadPDFButton } from '@/components/pdf/DownloadPDFButton';

export default function PRDResultPage({ prd }: { prd: { title: string; markdown: string } }) {
  return (
    <div>
      {/* ...render the PRD preview in the UI as normal... */}

      <DownloadPDFButton
        docType="prd"
        title={prd.title}
        companyName="Solirna AI"
        author="Joseph"
        content={prd.markdown}   // raw markdown straight from your FastAPI /prd response
        filename={`${prd.title}-PRD.pdf`}
      />
    </div>
  );
}
```

## 4. Pitch deck page usage

```tsx
import { DownloadPDFButton } from '@/components/pdf/DownloadPDFButton';

export default function PitchDeckResultPage({ deck }: { deck: { title: string; markdown: string } }) {
  return (
    <div>
      <DownloadPDFButton
        docType="pitchdeck"
        title={deck.title}
        tagline="Multi-currency wallets for cross-border Africa"
        companyName="Solirna AI"
        content={deck.markdown}  // each "# Heading" or "## Heading" becomes its own slide
        filename={`${deck.title}-PitchDeck.pdf`}
      />
    </div>
  );
}
```

## How the content should be structured

Since the pitch deck template turns every `# H1` / `## H2` into a new slide, prompt your AI
generation step (in FastAPI) to structure pitch deck markdown like:

```markdown
# Problem
Nigerian SMEs lose 15-20% margin on cross-border payments due to...

# Solution
A BaaS-powered multi-currency wallet using Anchor, Fincra, and Paystack rails...

# Market Size
- TAM: $XX B
- SAM: $XX B
- SOM: $XX M

# Business Model
| Revenue Stream | Description | Est. Margin |
|---|---|---|
| FX Spread | ... | ... |
| Transaction Fees | ... | ... |
```

For the PRD, since it's meant to flow as one continuous document, structure it more like a
normal doc with nested `## H2` sub-sections under a few `# H1` top-level sections — it will
render as a single flowing multi-page document rather than one-section-per-page.

## Notes / limitations

- The markdown parser (`markdownParser.ts`) supports: `#`/`##`/`###` headings, `**bold**`,
  `*italic*`/`_italic_`, bullet lists (`-`/`*`), numbered lists, pipe tables, fenced code blocks,
  and horizontal rules. It does **not** support nested lists, images, or links — if your AI
  output regularly includes those, tell me and I'll extend the parser.
- Both templates are pure client components — `pdf(doc).toBlob()` runs entirely in the browser,
  so there's no API route or server round-trip needed unless you later want to also email the
  PDF or store it in S3/Drive, in which case the same template components can be reused inside
  a Next.js Route Handler with `pdf(doc).toBuffer()`.
