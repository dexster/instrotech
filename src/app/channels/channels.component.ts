import {Component, ViewChild, ElementRef} from '@angular/core';
import {MatRadioGroup} from '@angular/material';
import {ChannelSelectService} from '../services/channel-select/channel-select.service';

@Component({
    selector: 'channels',
    templateUrl: './channels.component.html',
    styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent {
    @ViewChild('channelCheckboxGroup') channels: MatRadioGroup;

    constructor(private channelSelectService: ChannelSelectService,
                private el: ElementRef) {
    }

    channelChanged() {
        setTimeout(() => {
            let selectedChannels = [];
            let checkedChannels = this.el.nativeElement.querySelectorAll('.mat-checkbox-checked');
            checkedChannels.forEach((checkBox) => {
                selectedChannels.push(parseInt(checkBox.querySelector('input').value));
            });
            this.channelSelectService.updateChannels(selectedChannels);
        });
    }
}
