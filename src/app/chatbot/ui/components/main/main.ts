import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentLibraryModule } from '@camos/cds-angular';

import { ChatboxComponent } from '../chatbox/chatbox';

@Component({
  selector: 'app-main',
  templateUrl: './main.html',
  styleUrls: ['./main.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    ComponentLibraryModule,
    ChatboxComponent
  ]
})
export class MainComponent {
  constructor() {}
}
