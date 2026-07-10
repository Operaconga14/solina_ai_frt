// components/pdf/DownloadPDFButton.tsx
'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { PRDTemplate, PRDTemplateProps } from './PRDTemplate';
import { PitchDeckTemplate, PitchDeckTemplateProps } from './PitchDeckTemplate';

type PRDProps = { docType: 'prd' } & PRDTemplateProps;
type PitchDeckProps = { docType: 'pitchdeck' } & PitchDeckTemplateProps;

type DownloadPDFButtonProps = (PRDProps | PitchDeckProps) & {
  filename?: string;
  className?: string;
};

export function DownloadPDFButton(props: DownloadPDFButtonProps) {
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const doc =
        props.docType === 'prd' ? (
          <PRDTemplate title={props.title} companyName={props.companyName} author={props.author} content={props.content} />
        ) : (
          <PitchDeckTemplate title={props.title} tagline={props.tagline} companyName={props.companyName} content={props.content} />
        );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = props.filename ?? `${props.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className={
        props.className ??
        'px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      }
    >
      {generating ? 'Generating PDF…' : 'Download as PDF'}
    </button>
  );
}
