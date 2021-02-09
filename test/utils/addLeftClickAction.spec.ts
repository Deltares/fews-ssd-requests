import {addLeftClickAction} from '../../src/utils';

let svg: SVGElement;
const ssdName = "Meppelerdiep_10min";

describe("addLeftClickAction", function() {
  beforeEach(async function() {
    // first get a fresh SVG for midnight yesterday
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const yesterday = date.toISOString().split("T")[0];
    const url = "https://rwsos.webservices.deltares.nl/iwp/FewsWebServices/ssd?request=GetDisplay&ssd=" + ssdName + "&time=" + yesterday + "T00:00:00Z";

    const request = new XMLHttpRequest();
    request.open('GET', url, false)
    request.send()
    const xmlSvg = request.responseXML;
    if (xmlSvg) {
      svg = xmlSvg.documentElement as unknown as SVGElement;
    } else {
      fail("failed to get svg from:" + url);
    }
  });

  it("works", function() {
    function callback() {
      console.log("callback called")
    };
    addLeftClickAction(svg, callback);
  });
});
