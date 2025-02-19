import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators, } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GuestTokenService } from 'src/app/services/guest-token.service';
import { NotifiyService } from 'src/app/services/notifier.service';
import { Helper } from 'src/app/shared/helper';

export function timeRequired(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value;
        if (!value) {
            return { required: true };
        }
        return null;
    };
}

@Component({
    selector: 'app-guest-token-modal',
    templateUrl: './guest-token-modal.component.html',
    styleUrls: ['./guest-token-modal.component.scss'],
})
export class GuestTokenModalComponent implements OnInit {
    commonForm: UntypedFormGroup;
    modalRef: BsModalRef;
    config = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-right',
    };
    todayDate: Date = new Date();
    token: any;

    @ViewChild('template', { static: true }) template: TemplateRef<any>;

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        if (event.key === 'Escape' || event.code === 'Escape') {
            this.modalRef?.onHidden.subscribe(() => {
                this.closeModal();
            })
        }
    }

    constructor(private modalService: BsModalService, private _guestTokenService: GuestTokenService, private _notifiyService: NotifiyService, private _helper: Helper) { }

    ngOnInit(): void {
        this._initForm();
    }

    show(token): void {
        this.modalRef = this.modalService.show(this.template, this.config);
        if (token) {
            this.token = token;
            let date = new Date(token.start_date);
            let code_expiry = new Date(token.code_expiry);
            this.commonForm.patchValue({
                id: token.token_name,
                state: token.state,
                start_date: date,
                code_expiry: code_expiry,
            });
        }
    }

    _initForm() {
        this.commonForm = new UntypedFormGroup({
            id: new UntypedFormControl(null, [Validators.required]),
            state: new UntypedFormControl(null),
            start_date: new UntypedFormControl(null, [timeRequired()]),
            code_expiry: new UntypedFormControl(null, [timeRequired()]),
        });
    }

    //add or update
    submit(update) {
        let start_date_milliseconds = new Date(new Date(this.commonForm.value.start_date).toISOString()).getTime();
        let code_expiry_milliseconds = new Date(new Date(this.commonForm.value.code_expiry).toISOString()).getTime();
        if (start_date_milliseconds > code_expiry_milliseconds) {
            this._notifiyService.showNotification('error', this._helper.trans.instant('validation-title.please-enter-valid-date'))
            return;
        }
        this.commonForm.patchValue({
            id: this.commonForm.value.id?.toString().trim(),
        })
        if (this.commonForm.invalid) {
            this.commonForm.markAllAsTouched();
            return;
        }

        let json = {
            token_name: this.commonForm.value.id,
            state: this.commonForm.value.state,
            start_date: this.commonForm.value.start_date,
            code_expiry: this.commonForm.value.code_expiry
        }

        if (update) {
            json['id'] = this.token._id;
        }

        this._guestTokenService.add_and_update_guest_token(json).then((res: any) => {
            if (res.success) {
                this.modalRef.hide();
                this.commonForm.reset();
                this.token = {};
            }
        })
    }

    closeModal() {
        this.modalRef?.hide();
        this.commonForm.reset();
        this.token = {};
    }

    ngDestroy() {
        this.token = {};
    }
}
