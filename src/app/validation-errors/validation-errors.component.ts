import { Component, OnInit, Input,ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'validation-errors',
  templateUrl: './validation-errors.component.html',
  styleUrls: ['./validation-errors.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationErrorsComponent implements OnInit {
  @Input() errorPrefix: string;
  @Input() errors: ValidationErrors;

  constructor() {}

  ngOnInit() {}

}