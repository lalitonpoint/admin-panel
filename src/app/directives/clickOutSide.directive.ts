import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[clickOutside]'
})
export class ClickOutsideDirective {
    // tslint:disable-next-line:variable-name
    constructor(private _elementRef: ElementRef) {
    }

    @Output()
    public clickOutside = new EventEmitter<MouseEvent>();

    @HostListener('document:click', ['$event', '$event.target'])
    public onClick(event: MouseEvent, targetElement: HTMLElement): void {
        if (!targetElement) {
            return;
        }

        const clickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.clickOutside.emit(event);
        }
    }
}
