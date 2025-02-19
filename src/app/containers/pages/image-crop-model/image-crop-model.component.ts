import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
    selector:'app-image-crop-model',
    templateUrl:'./image-crop-model.component.html'
})
export class ImageCropModelComponent {

    modalRef: BsModalRef;
    config = {
      backdrop: true,
      ignoreBackdropClick: true,
      class: 'modal-popup'
    };

    @ViewChild('template', { static: true }) template: TemplateRef<any>;

    imageChangedEvent:Event;
    aspectRatio:number;
    resizeToWidth:number;
    @Output() updateImage = new EventEmitter<any>();

    image_file;

  constructor(private modalService: BsModalService) { }


  imageCropped(event: ImageCroppedEvent) {
    this.image_file = dataURLtoFile(event.base64,'file.png')
  }

  show(aspectRatio,resizeToWidth){
      this.aspectRatio = aspectRatio;
      this.resizeToWidth = resizeToWidth;
      this.modalRef = this.modalService.show(this.template, this.config)
  }

  confirm(){
    this.updateImage.emit(this.image_file)
    this.onClose()
  }

  onClose(){
    this.modalRef.hide()
  }

}




function dataURLtoFile(dataurl, filename) {

  let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {type:mime});
}
