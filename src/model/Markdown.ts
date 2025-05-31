export class Markdown {
  id: string;
  doctorId?: string;
  clinicId?: string;
  contentHTML: string;
  contentMarkdown: string;
  description?: string;

  constructor(data: Partial<Markdown>) {
    this.id = data.id || '';
    this.doctorId = data.doctorId;
    this.clinicId = data.clinicId;
    this.contentHTML = data.contentHTML || '';
    this.contentMarkdown = data.contentMarkdown || '';
    this.description = data.description;
  }
}
