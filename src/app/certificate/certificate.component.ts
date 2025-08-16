import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent {
  participantName: string = '';
  previewName: string = 'Your Name Here';
  isGenerating: boolean = false;

  private nameUpdate = new Subject<string>();

  constructor() {
    // Debounce the input to avoid updating the preview on every keystroke
    this.nameUpdate.pipe(debounceTime(300)).subscribe((name) => {
      this.previewName = name.trim() ? name : 'Your Name Here';
    });
  }

  updatePreview() {
    this.nameUpdate.next(this.participantName);
  }

  async downloadAsPdf() {
    if (!this.participantName.trim()) {
      alert('Please enter a name.');
      return;
    }

    this.isGenerating = true;
    const certificateElement = document.getElementById('certificate-wrapper');

    if (certificateElement) {
      try {
        const canvas = await html2canvas(certificateElement, {
          scale: 3, // Increase scale for better quality
          useCORS: true,
        });

        const imgData = canvas.toDataURL('image/png');

        // Determine PDF orientation based on image dimensions
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const orientation = imgWidth > imgHeight ? 'l' : 'p';

        const pdf = new jsPDF(orientation, 'px', [imgWidth, imgHeight]);

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${this.participantName.replace(/ /g, '_')}_Certificate.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Sorry, an error occurred while generating the PDF.');
      } finally {
        this.isGenerating = false;
      }
    } else {
      console.error('Certificate element not found');
      this.isGenerating = false;
    }
  }
}
