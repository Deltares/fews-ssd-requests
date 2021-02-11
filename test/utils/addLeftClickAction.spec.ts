import {addLeftClickAction, FEWS_NAMESPACE} from '../../src/utils';

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
    // add custom style to each element to check that it is not removed
    svg.querySelectorAll('*').forEach(function(el: Element) {
      const style = el.getAttribute("style") || "";
      el.setAttribute('style', 'test: 123;' + style)
    });

    let callbackCounter = 0;
    function callback() {
      callbackCounter += 1;
    };
    addLeftClickAction(svg, callback);

    // now check the results
    let expectedCallbacks = 0;
    svg.querySelectorAll('*').forEach(function(el: Element) {
      const style = el.getAttribute("style") || "";
      if (el.hasAttributeNS(FEWS_NAMESPACE, 'id')) {
        // simulate a click
        var evObj = document.createEvent('Events');
        evObj.initEvent("click", true, false);
        el.dispatchEvent(evObj);
        expectedCallbacks += 1;
        const pointerStyle = "cursor: pointer;";
        expect(style.substring(0,pointerStyle.length)).toEqual(pointerStyle);
      } else {
        const defaultStyle = "cursor: default;";
        expect(style.substring(0,defaultStyle.length)).toEqual(defaultStyle);
      };
      // check that the original style is still there
      expect(style).toMatch(/test: 123;/);
    });
    expect(callbackCounter).toEqual(expectedCallbacks);
  });
});
