
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extended type for jsPDF with autoTable plugin
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

type Answer = {
  question: string;
  answer: string;
};

/**
 * Formats the response data as markdown
 */
export const formatResponseAsMarkdown = (
  title: string,
  respondent: string | null,
  submittedDate: string,
  answers: Answer[]
): string => {
  const dateStr = new Date(submittedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let markdown = `# ${title}\n\n`;
  
  if (respondent) {
    markdown += `**Submitted by:** ${respondent}\n\n`;
  }
  
  markdown += `**Date:** ${dateStr}\n\n`;
  markdown += `## Responses\n\n`;
  
  answers.forEach((answer, index) => {
    markdown += `### ${answer.question}\n\n${answer.answer}\n\n`;
  });
  
  return markdown;
};

/**
 * Exports response data as a markdown file
 */
export const exportAsMarkdown = (
  title: string,
  respondent: string | null,
  submittedDate: string,
  answers: Answer[]
): void => {
  const markdown = formatResponseAsMarkdown(title, respondent, submittedDate, answers);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  saveAs(blob, `${title.replace(/\s+/g, '_')}_response.md`);
};

/**
 * Exports response data as a PDF file
 */
export const exportAsPDF = (
  title: string,
  respondent: string | null,
  submittedDate: string,
  answers: Answer[]
): void => {
  // Initialize PDF document
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  // Set up fonts and sizes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(title, 20, 20);
  
  // Add submission details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  
  const dateStr = new Date(submittedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  
  let yPosition = 30;
  
  if (respondent) {
    doc.text(`Submitted by: ${respondent}`, 20, yPosition);
    yPosition += 8;
  }
  
  doc.text(`Date: ${dateStr}`, 20, yPosition);
  yPosition += 15;
  
  // Add responses as tables
  answers.forEach((answer, index) => {
    // Add question as header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(answer.question, 20, yPosition);
    yPosition += 8;
    
    // Add answer as content
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    // Split long text into multiple lines
    const textLines = doc.splitTextToSize(answer.answer, 170);
    
    // Check if we need a new page
    if (yPosition + textLines.length * 7 > 280) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(textLines, 20, yPosition);
    yPosition += textLines.length * 7 + 15;
  });
  
  // Save the PDF
  doc.save(`${title.replace(/\s+/g, '_')}_response.pdf`);
};
