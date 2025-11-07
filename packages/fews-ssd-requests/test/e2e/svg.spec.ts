import { ClickCallbackFunction } from "../../src/utils/clickCallbackFunction";
import { SsdWebserviceProvider } from "../../src/ssdWebserviceProvider";
import { FEWS_NAMESPACE } from "../../src/response/FEWS_NAME_SPACE";
import { addLeftClickAction } from "../../src/utils/addLeftClickAction";
import { describe, expect, it } from 'vitest';

const baseUrl = import.meta.env.VITE_DOCKER_URL || "";

describe("datesFromPeriod", function () {

  it("works", async function () {
    const ssdName = "coastal_flooding1";
    const apiEndpoint = "ssd";
    const provider = new SsdWebserviceProvider(baseUrl);
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const yesterday = date.toISOString().split("T")[0];
    const url =
      baseUrl +
      apiEndpoint +
      "?request=GetDisplay&ssd=" +
      ssdName +
      "&time=" +
      yesterday +
      "T00:00:00Z";

    const svg = await provider.getSvg(url);

    let callbackCounter = 0;
    let callback: ClickCallbackFunction;
    // eslint-disable-next-line prefer-const
    callback = function (event: Event) {
      callbackCounter += 1;
      expect(event.target).toBeDefined();
      if (event.target) {
        const svgElement = event.target as SVGElement;
        expect(svgElement instanceof SVGElement).toBeTruthy();
      }
    };
    addLeftClickAction(svg, callback);

    // now check the results
    let expectedCallbacks = 0;
    svg.querySelectorAll<SVGElement>("*").forEach(function (el) {
      const style = el.style;
      if (el.hasAttributeNS(FEWS_NAMESPACE, "click")) {
        // simulate a click
        const event = new Event("click", { bubbles: true, cancelable: false });
        el.dispatchEvent(event);
        expectedCallbacks += 1;
        expect(style.cursor).toEqual("pointer");
      }
    });
    expect(callbackCounter).toEqual(expectedCallbacks);
  });
});
