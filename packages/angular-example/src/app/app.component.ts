import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  src  = "https://rwsos-dataservices-ont.avi.deltares.nl/iwp/FewsWebServices/ssd?request=GetDisplay&ssd=LB_Maas_StPieter_Lith_Hoogwater_10min"
  messages: string[] = []

  onAction(event: any) {
    console.log(event)
    this.addToMessageStack(`@action ${event.detail}`)
  }

  onClick(event: MouseEvent) {
    const target = event.target as SVGElement
    this.addToMessageStack(`@click <${target.tagName} fews:id="${target.id}" fews:click="${target.hasAttributeNS('http://www.wldelft.nl/fews', 'click')}">`)
  }

  onLoad(event: Event) {
    this.addToMessageStack(`@load ${event.timeStamp} ms`)
  }

  addToMessageStack(message: string) {
    if ( this.messages.length > 8 ) this.messages.shift()
    this.messages.push(message)
  }
}
