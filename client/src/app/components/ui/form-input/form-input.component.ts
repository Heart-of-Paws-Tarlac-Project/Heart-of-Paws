import { Component } from '@angular/core';
import { Input } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-input.component.html',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
  styleUrl: './form-input.component.css',
})
export class FormInputComponent {
  @Input() label!: string;
  @Input() type!: string;
  @Input() id!: string;
  @Input() controlName!: string;
  @Input() placeholder!: string;
}
