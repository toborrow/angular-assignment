// src/app/components/user-form/user-form.component.ts

import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms'
import { User } from '../../models/user.model'
import { UserService } from '../../services/user-service.service'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  error: string | null = null;
  newSkill = new FormControl('');
  submitAttempted = false;
  
  // Predefined skills for suggestions
  skillSuggestions: string[] = [
    'JavaScript Development',
    'Python Development',
    'Java Development',
    'UX/UI Design',
    'Project Management',
    'Data Analysis',
    'DevOps',
    'Mobile Development',
    'Cloud Computing',
    'Machine Learning'
  ];

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      full_name: [{ value: '', disabled: true }],
      age: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(150),
        Validators.pattern(/^[0-9]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      skills: [[] as string[], [Validators.required, Validators.minLength(1)]]
    })

    // Subscribe to first_name and last_name changes to update full_name
    this.userForm.get('first_name')?.valueChanges.subscribe(() => this.updateFullName());
    this.userForm.get('last_name')?.valueChanges.subscribe(() => this.updateFullName());
  }

  ngOnInit() {
    this.loadUserData()
  }

  loadUserData() {
    this.loading = true;
    this.error = null;
    this.userService.getUser()
      .subscribe({
        next: (user) => {
          this.userForm.patchValue(user);
          this.updateFullName();
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load user data: ' + error.message;
          this.loading = false;
        }
      })
  }

  onSave() {
    this.submitAttempted = true;
    this.error = null;

    if (this.userForm.valid) {
      const formValue = {
        ...this.userForm.value,
        full_name: this.userForm.get('full_name')?.value
      };
      
      this.loading = true;
      this.userService.updateUser(formValue as User)
        .subscribe({
          next: () => {
            this.showSuccessMessage('User updated successfully');
            this.loading = false;
            this.submitAttempted = false;
          },
          error: (error) => {
            this.error = 'Error updating user: ' + error.message;
            this.loading = false;
          }
        });
    } else {
      this.error = 'Please fix the validation errors before submitting.';
      this.markFormGroupTouched(this.userForm);
    }
  }

  private showSuccessMessage(message: string) {
    this.error = null;
    // Using a more elegant way to show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.querySelector('.user-form')?.prepend(successDiv);
    
    // Remove the message after 3 seconds
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Error handling methods for the form fields
  getErrorMessage(controlName: string): string | null {
    const control = this.userForm.get(controlName);
    if (control && (control.errors && (control.touched || this.submitAttempted))) {
      if (control.errors['required']) {
        return 'This field is required';
      } else if (control.errors['email']) {
        return 'Enter a valid email';
      } else if (control.errors['pattern']) {
        if (controlName === 'email') {
          return 'Enter a valid email address';
        } else if (controlName === 'age') {
          return 'Age must be a number';
        }
      } else if (control.errors['min']) {
        return 'Age must be a positive number';
      } else if (control.errors['max']) {
        return 'Age must be less than 150';
      } else if (control.errors['minlength']) {
        if (controlName === 'skills') {
          return 'At least one skill is required';
        }
        return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
      }
    }
    return null;
  }

  // Update full_name when first_name or last_name changes
  private updateFullName() {
    const firstName = this.userForm.get('first_name')?.value || '';
    const lastName = this.userForm.get('last_name')?.value || '';
    const fullName = `${firstName} ${lastName}`.trim();
    this.userForm.get('full_name')?.setValue(fullName);
  }

  addSkill(skill: string) {
    if (skill.trim()) {
      const currentSkills = this.userForm.get('skills')?.value || [];
      if (!currentSkills.includes(skill.trim())) {
        this.userForm.patchValue({
          skills: [...currentSkills, skill.trim()]
        });
      }
      this.newSkill.setValue(''); // Clear the input
    }
  }

  removeSkill(skillToRemove: string) {
    const currentSkills = this.userForm.get('skills')?.value || [];
    this.userForm.patchValue({
      skills: currentSkills.filter((skill: string) => skill !== skillToRemove)
    });
  }
}
