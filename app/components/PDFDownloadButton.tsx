'use client';
import { pdf } from '@react-pdf/renderer';
import { PRDTemplate } from './PRDTemplate';


export function DownloadPRDButton({ title, content }: { title: string; content: string }) {
  const handleDownload = async () => {
    const blob = await pdf(
      <PRDTemplate title={title} content={content} />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
      Download as PDF
    </button>
  );
}