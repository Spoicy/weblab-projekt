import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-update-form',
  templateUrl: './update-form.component.html',
  styleUrl: './update-form.component.scss'
})
export class UpdateFormComponent {
  @Input() tech!: any;
  @Output() closeFormEvent = new EventEmitter<string>();
  @Output() updateRefreshEvent = new EventEmitter<string>();
  UpdateForm!: FormGroup;
  isSubmit = true;
  submitMessage = "";

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (this.tech.published) {
      this.UpdateForm = this.formBuilder.group({
        name: [this.tech.name, Validators.required],
        category: [this.tech.category, Validators.required],
        ring: [this.tech.ring, Validators.required],
        descTechnology: [this.tech.desc_technology, Validators.required],
        descClassification: [this.tech.desc_classification, Validators.required]
      });
    } else {
      this.UpdateForm = this.formBuilder.group({
        name: [this.tech.name, Validators.required],
        category: [this.tech.category, Validators.required],
        ring: [this.tech.ring],
        descTechnology: [this.tech.desc_technology, Validators.required],
        descClassification: [this.tech.desc_classification]
      });
    }
  }

  onSubmit() {
    if (this.UpdateForm.valid) {
      const formData = this.UpdateForm.value;
      formData.id = this.tech.id;
      axios
        .put('http://localhost:8000/technology/update', formData)
        .then(response => {
          this.submitMessage = "Tech updated";
          this.updateRefreshEvent.emit('update');
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

  emitClose() {
    this.closeFormEvent.emit('close');
  }
}
