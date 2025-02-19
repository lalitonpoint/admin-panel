import { Directive, HostListener, ElementRef, Optional, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

@Directive({
    selector: '[appFocus]',
})
export class InputFocusDirective {
    isArray: boolean = false;
    @ViewChildren('inputElements') inputElements: QueryList<ElementRef>;
    constructor(private el: ElementRef, private renderer: Renderer2, @Optional() private ngForm: NgForm, @Optional() private formGroupDirective: FormGroupDirective) { }

    @HostListener('document:click', ['$event.target'])
    onClick(target: any) {
        if (target.type === 'submit' || target.type === 'button') {
            let form: any = null;
            let formType;
            if (this.ngForm) {
                form = this.ngForm;
                formType = 1;
            } else if (this.formGroupDirective) {
                form = this.formGroupDirective.form;
                formType = 2;
            }

            if (form && !form.valid) {
                const firstInvalidControl = this.getFirstInvalidControl(form);
                if (formType == 1) {
                    if (firstInvalidControl) {
                        const invalidControlElement = this.el.nativeElement.querySelector(`[name="${firstInvalidControl}"]`);

                        if (invalidControlElement) {
                            invalidControlElement.focus();
                        }
                    }
                } else if (firstInvalidControl && !this.isArray) {
                    const invalidControlElement = this.el.nativeElement.querySelector(`[formControlName="${firstInvalidControl}"]`);
                    if (invalidControlElement) {
                        invalidControlElement.focus();
                    }
                }

                if (formType == 2 && this.isArray) {
                    if (firstInvalidControl) {
                        const invalidControlElement = this.el.nativeElement.querySelector(`[id="${firstInvalidControl}"]`);
                        if (invalidControlElement) {
                            invalidControlElement.focus();
                        }
                    }
                }
            }
        }
    }

    private getFirstInvalidControl(form: any): string | null {
        const controls = (form.controls as FormControl | FormArray) || (form.form.controls as FormControl | FormArray);

        for (const controlName in controls) {
            if (controls[controlName].constructor == FormArray) {
                for (const arrayControls in controls[controlName].controls) {
                    if (controls[controlName].controls[arrayControls].invalid) {
                        this.isArray = true;
                        return arrayControls;
                    }
                }
            }
            if (controls[controlName].invalid) {
                this.isArray = false;
                return controlName;
            }
        }
        return null;
    }
}
