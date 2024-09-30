import { Component } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, BsDropdownModule, ButtonsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  form: FormGroup;
  undoStack: any[] = [];
  redoStack: any[] = [];
  countries: string[] = ['USA', 'Canada', 'Germany', 'Australia'];
  selectedCountry: string = '';
  isDarkMode: boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      email: [''],
      agree: [false],
      country: [''],
    });

    this.form.valueChanges.subscribe((value) => {
      // Only push to undoStack if there is a change
      if (
        this.undoStack.length === 0 ||
        !this.areObjectsEqual(value, this.undoStack[this.undoStack.length - 1])
      ) {
        this.undoStack.push({ ...value });
        this.redoStack = []; // Clear redoStack on new changes
      }
    });
  }

  // Method to compare two form values (deep comparison)
  areObjectsEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  undo() {
    if (this.undoStack.length > 1) {
      const currentState = this.undoStack.pop();
      this.redoStack.push(currentState);
      const previousState = this.undoStack[this.undoStack.length - 1];
      console.log();

      this.selectedCountry = previousState.country;
      this.form.setValue(previousState, { emitEvent: false });
    } else {
      this.form.reset();
      this.undoStack = [];
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop();
      this.undoStack.push({ ...nextState });
      this.form.setValue(nextState, { emitEvent: false });
    }
  }

  onSelectCountry(country: string) {
    this.selectedCountry = country;
    this.form.controls['country'].setValue(country);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }
}
