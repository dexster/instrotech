import {Injectable, Inject} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {environment} from '../../../environments/environment';

@Injectable()
export class LoggerService {

    // constructor(private ngxLogger: NGXLogger,
    //             @Inject('className') public className?: string) {
    // }
    constructor(private ngxLogger: NGXLogger) {
    }

    debug(message: string) {
        if (!environment.production) {
            this.ngxLogger.debug(message);
        }
    }

    error(message: string) {
        this.ngxLogger.error(message);
    }
}
