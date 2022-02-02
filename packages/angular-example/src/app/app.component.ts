import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  src  = "https://rwsos-dataservices-ont.avi.deltares.nl/iwp/FewsWebServices/ssd?request=GetDisplay&ssd=LB_Maas_StPieter_Lith_Hoogwater_10min"
  messages: string[] = []


  ngOnInit() {
    setInterval(() => {
      this.reduceMessageStack()
    }, 5000);
  }

  onClick(event: MouseEvent) {
    const target = event.target as SVGElement
    this.messages.push(`@click on <${target.tagName} fews:id="${target.id}" fews:click="${target.hasAttributeNS('http://www.wldelft.nl/fews', 'click')}">`)
  }

  onLoad(event: Event) {
    this.messages.push(`@load ${event.timeStamp} ms`)
  }

  reduceMessageStack() {
    console.log(this.messages.length)
    if ( this.messages.length > 10 ) this.messages.shift()
  }

}
