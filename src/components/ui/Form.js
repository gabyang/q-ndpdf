import { FormGroup } from './FormGroup';
import { Button } from './Button';

export class Form {
  constructor(id, title, fields, submitText) {
    this.id = id;
    this.title = title;
    this.fields = fields;
    this.submitText = submitText;
  }

  render() {
    const formContainer = document.createElement('div');
    formContainer.id = this.id;
    formContainer.className = 'form-container';

    const title = document.createElement('h2');
    title.textContent = this.title;
    formContainer.appendChild(title);

    const form = document.createElement('form');
    form.id = `${this.id}-element`;

    this.fields.forEach(field => {
      const formGroup = new FormGroup(field.id, field.label, field.type);
      form.appendChild(formGroup.render());
    });

    const submitButton = new Button(this.submitText, 'submit');
    form.appendChild(submitButton.render());

    formContainer.appendChild(form);
    return formContainer;
  }
} 