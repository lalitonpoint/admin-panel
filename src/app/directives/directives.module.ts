import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective} from './clickOutSide.directive';
import { NoPasteDropDirective } from './no-paste-drop.directive';
import { InputFocusDirective } from './focus.directive';


@NgModule({
  declarations: [ClickOutsideDirective, NoPasteDropDirective, InputFocusDirective],
  imports: [
    CommonModule
  ],
  exports: [
    ClickOutsideDirective,
    NoPasteDropDirective,
    InputFocusDirective
  ]
})
export class DirectivesModule { }
