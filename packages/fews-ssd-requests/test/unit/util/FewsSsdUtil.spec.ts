import FewsSsdUtil from "../../../src/util/FewsSsdUtil";
import ClickCallbackFunction from "../../../src/util/ClickCallbackFunction";
import {SsdWebserviceProvider} from "../../../src/SsdWebserviceProvider";
import {FEWS_NAMESPACE} from "../../../src/data/FEWS_NAME_SPACE";

describe("util tests", function () {
    it("works", async function () {
        const ssdName = "Meppelerdiep_10min";
        const baseUrl = process.env.TEST_URL || "";
        const apiEndpoint = "FewsWebServices/ssd";
        const provider = new SsdWebserviceProvider(baseUrl);
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const yesterday = date.toISOString().split("T")[0];
        const url = baseUrl + apiEndpoint + "?request=GetDisplay&ssd=" + ssdName + "&time=" + yesterday + "T00:00:00Z";

        const svg = await provider.getSvg(url);
        // add custom style to each element to check that it is not removed
        svg.querySelectorAll('*').forEach(function (el: Element) {
            const style = el.getAttribute("style") || "";
            el.setAttribute('style', 'test: 123;' + style)
        });

        let callbackCounter = 0;
        let callback: ClickCallbackFunction;
        // eslint-disable-next-line prefer-const
        callback = function (event: Event) {
            callbackCounter += 1;
            expect(event.target).toBeDefined();
            if (event.target) {
                expect(event.target.toString()).toMatch(/SVGElement/);
            }
        };
        FewsSsdUtil.addLeftClickAction(svg, callback);

        // now check the results
        let expectedCallbacks = 0;
        svg.querySelectorAll('*').forEach(function (el: Element) {
            const style = el.getAttribute("style") || "";
            if (el.hasAttributeNS(FEWS_NAMESPACE, 'id')) {
                // simulate a click
                const evObj = document.createEvent('Events');
                evObj.initEvent("click", true, false);
                el.dispatchEvent(evObj);
                expectedCallbacks += 1;
                const pointerStyle = "cursor: pointer;";
                expect(style.substring(0, pointerStyle.length)).toEqual(pointerStyle);
            } else {
                const defaultStyle = "cursor: default;";
                expect(style.substring(0, defaultStyle.length)).toEqual(defaultStyle);
            }
            ;
            // check that the original style is still there
            expect(style).toMatch(/test: 123;/);
        });
        expect(callbackCounter).toEqual(expectedCallbacks);
    })

    it("works for 1 minute period strings", function () {
        const start = "2021-01-01T08:50:00Z";
        const end = "2021-01-01T09:10:00Z";
        const period = start + "/" + end + "/PT1M";
        const dates = FewsSsdUtil.datesFromPeriod(period);
        // check the start and end
        expect(dates[0]).toEqual(new Date(start));
        expect(dates[dates.length - 1]).toEqual(new Date(end));
        // check the spacing between dates
        let previous = dates[0].getTime();
        for (let i = 1; i < dates.length; i++) {
            const value = dates[i].getTime();
            expect(value - previous).toEqual(1000 * 60);
            previous = value;
        }
    });

    it("works for 10 minute period strings", function () {
        const start = "2021-01-01T08:50:00Z";
        const end = "2021-01-02T00:00:00Z";
        const period = start + "/" + end + "/PT10M";
        const dates = FewsSsdUtil.datesFromPeriod(period);
        // check the start and end
        expect(dates[0]).toEqual(new Date(start));
        expect(dates[dates.length - 1]).toEqual(new Date(end));
        // check the spacing between dates
        let previous = dates[0].getTime();
        for (let i = 1; i < dates.length; i++) {
            const value = dates[i].getTime();
            expect(value - previous).toEqual(1000 * 60 * 10);
            previous = value;
        }
    });

    it("works for 1 hour period strings", function () {
        const start = "2021-01-01T08:00:00Z";
        const end = "2021-01-02T12:00:00Z";
        const period = start + "/" + end + "/PT1H";
        const dates = FewsSsdUtil.datesFromPeriod(period);
        // check the start and end
        expect(dates[0]).toEqual(new Date(start));
        expect(dates[dates.length - 1]).toEqual(new Date(end));
        // check the spacing between dates
        let previous = dates[0].getTime();
        for (let i = 1; i < dates.length; i++) {
            const value = dates[i].getTime();
            expect(value - previous).toEqual(1000 * 60 * 60);
            previous = value;
        }
    });

    it("works for 1 day period strings", function () {
        const start = "2021-01-01T05:00:00Z";
        const end = "2021-01-10T05:00:00Z";
        const period = start + "/" + end + "/P1D";
        const dates = FewsSsdUtil.datesFromPeriod(period);
        // check the start and end
        expect(dates[0]).toEqual(new Date(start));
        expect(dates[dates.length - 1]).toEqual(new Date(end));
        // check the spacing between dates
        let previous = dates[0].getTime();
        for (let i = 1; i < dates.length; i++) {
            const value = dates[i].getTime();
            expect(value - previous).toEqual(1000 * 60 * 60 * 24);
            previous = value;
        }
    });

    it("works for 1 week period strings", function () {
        const start = "2021-01-01T05:00:00Z";
        const end = "2021-01-15T05:00:00Z";
        const period = start + "/" + end + "/P1W";
        const dates = FewsSsdUtil.datesFromPeriod(period);
        // check the start and end
        expect(dates[0]).toEqual(new Date(start));
        expect(dates[dates.length - 1]).toEqual(new Date(end));
        // check the spacing between dates
        let previous = dates[0].getTime();
        for (let i = 1; i < dates.length; i++) {
            const value = dates[i].getTime();
            expect(value - previous).toEqual(1000 * 60 * 60 * 24 * 7);
            previous = value;
        }
    });

    it("works for crazy period strings", function () {
        const start = "2021-01-01T00:00:00Z";
        const end = "2021-01-25T03:06:09Z";
        const period = start + "/" + end + "/P1W1DT1H2M3S";
        const dates = FewsSsdUtil.datesFromPeriod(period);
        // check the start and end
        expect(dates[0]).toEqual(new Date(start));
        expect(dates[dates.length - 1]).toEqual(new Date(end));
        // check the spacing between dates
        let previous = dates[0].getTime();
        const days = 8;
        const hours = days * 24 + 1;
        const minutes = hours * 60 + 2;
        const seconds = minutes * 60 + 3;
        for (let i = 1; i < dates.length; i++) {
            const value = dates[i].getTime();
            expect(value - previous).toEqual(1000 * seconds);
            previous = value;
        }
    });
});
