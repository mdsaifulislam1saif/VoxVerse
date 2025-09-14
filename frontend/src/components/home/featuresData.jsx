import { Mic, FileText, Upload, Download } from 'lucide-react';

const features = [
  {
    icon: <Upload className="h-8 w-8 text-blue-600" />,
    title: 'Multiple File Formats',
    description: 'Support for PDF documents and various image formats for text extraction.'
  },
  {
    icon: <Mic className="h-8 w-8 text-green-600" />,
    title: 'Text to Speech',
    description: 'Convert any text to natural-sounding audio in multiple languages.'
  },
  {
    icon: <FileText className="h-8 w-8 text-purple-600" />,
    title: 'Smart Summarization',
    description: 'Generate concise summaries and convert them to audio automatically.'
  },
  {
    icon: <Download className="h-8 w-8 text-orange-600" />,
    title: 'Export & Download',
    description: 'Download your audio files in MP3 format for offline listening.'
  }
];
export default features;