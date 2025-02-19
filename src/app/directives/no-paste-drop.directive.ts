import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[noPasteDrop]'
})
export class NoPasteDropDirective {
  
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    if(inputElement.type != 'password'){
      event.preventDefault();
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.type === 'number') {
      event.preventDefault();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    // Get the keyCode of the pressed key
    
    const keyCode = event.keyCode || event.which;
    const notallowedKeys = [ 38, 40]; 
    const inputElement = event.target as HTMLInputElement;
    //Not Allow arrow keys only for input type number
    if (notallowedKeys.includes(keyCode)) {
      if (inputElement.type === 'number') {
        event.preventDefault();
      }
    }
  }

}
