import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class ChannelSelectService {

    private selectedChannels = new Subject<Array<number>>();

    channelsUpdated$ = this.selectedChannels.asObservable();

    updateChannels(channel: number[]) {
        this.selectedChannels.next(channel);
    }
}
