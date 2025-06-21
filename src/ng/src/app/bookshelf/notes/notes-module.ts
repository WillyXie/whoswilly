import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoteTools } from './note-tools/note-tools';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NoteTools,
  ],
  exports: [
    NoteTools
  ],
})
export class NotesModule {}
