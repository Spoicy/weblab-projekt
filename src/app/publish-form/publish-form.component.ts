import { Component, EventEmitter, Input, Output, StateKey } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-publish-form',
  templateUrl: './publish-form.component.html',
  styleUrl: './publish-form.component.scss'
})
export class PublishFormComponent {
  @Input() tech!: any;
  @Output() closeFormEvent = new EventEmitter<string>();
  PublishForm!: FormGroup;
  isSubmit = true;
  submitMessage = "";

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.PublishForm = this.formBuilder.group({
      ring: [this.tech.ring, Validators.required],
      descClassification: [this.tech.desc_classification, Validators.required]
    });
  }

  onSubmit() {
    if (this.PublishForm.valid) {
      const formData = this.PublishForm.value;
      formData.id = this.tech.id;
      axios
        .put('http://localhost:8000/technology/publish', formData)
        .then(response => {
          this.submitMessage = "Tech updated successfully!";
          this.closeFormEvent.emit("update");
        })
        .catch(error => {
          console.log(error);
          this.submitMessage = "Tech failed to update";
        })
        .finally(() => {
          this.isSubmit = true;
          setTimeout(() => {
            this.isSubmit = false;
          }, 5000);
        })
    }
  }
}
