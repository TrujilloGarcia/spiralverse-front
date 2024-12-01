import { Component, OnInit } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { SwUpdate, VersionReadyEvent, SwPush } from '@angular/service-worker';
import { filter, map } from 'rxjs/operators';
import { NewsletterService } from '../app/newsletter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  readonly VAPID_PUBLIC_KEY = "BHF1I_hdKc3DKOierBCm2jWfGeX2CVc1QCrM7Ph_mlKkx2lScB12V5l3pAJGK_ZXW-EdMln7hSiwD5-_JUky3BY"
  isOnline: boolean;
  modalVersion: boolean;
  modalPwaEvent: any;
  modalPwaPlatform: string|undefined;

  title = 'spiralverse-front';

  constructor(private platform: Platform,
              private swUpdate: SwUpdate,
              private swPush: SwPush,
              private newsletterService: NewsletterService) {
    this.isOnline = false;
    this.modalVersion = false;
  }

  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
    .then(sub => this.newsletterService.addPushSubscriber(sub).subscribe())
    .catch(err => console.error("Could not subscribe to notifications", err));
  }

  public ngOnInit(): void {
    this.updateOnlineStatus();

    window.addEventListener('online',  this.updateOnlineStatus.bind(this));
    window.addEventListener('offline', this.updateOnlineStatus.bind(this));

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.pipe(
        filter((evt: any): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
        map((evt: any) => {
          console.info(`currentVersion=[${evt.currentVersion} | latestVersion=[${evt.latestVersion}]`);
          this.modalVersion = true;
        }),
      );
    }

    this.loadModalPwa();
  }

  private updateOnlineStatus(): void {
    this.isOnline = window.navigator.onLine;
    console.info(`isOnline=[${this.isOnline}]`);
  }

  public updateVersion(): void {
    this.modalVersion = false;
    window.location.reload();
  }

  public closeVersion(): void {
    this.modalVersion = false;
  }

  private loadModalPwa(): void {
    if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.modalPwaPlatform = 'ANDROID';
      });
    }

      if (this.platform.IOS && this.platform.SAFARI) {
        const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
        if (!isInStandaloneMode) {
          this.modalPwaPlatform = 'IOS';
        }
      }
    }

    public addToHomeScreen(): void {
      this.modalPwaEvent.prompt();
      this.modalPwaPlatform = undefined;
    }

    public closePwa(): void {
      this.modalPwaPlatform = undefined;
    }



}
