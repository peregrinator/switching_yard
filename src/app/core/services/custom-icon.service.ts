import { Injectable } from "@angular/core"

import { DomSanitizer } from '@angular/platform-browser'
import { MatIconRegistry } from '@angular/material/icon'


@Injectable({
  providedIn: 'root'
})
export class CustomIconService {
  constructor(
    public matIconRegistry: MatIconRegistry,
    public domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'settings',
      this.domSanitizer.bypassSecurityTrustResourceUrl('assets/svg/settings.svg')
    )
  }
}