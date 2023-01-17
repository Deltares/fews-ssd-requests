import { ClickCallbackFunction } from "../../../src/utils/clickCallbackFunction";
import { SsdWebserviceProvider } from "../../../src/ssdWebserviceProvider";
import { FEWS_NAMESPACE } from "../../../src/response/FEWS_NAME_SPACE";
import { addLeftClickAction } from "../../../src/utils/addLeftClickAction";
import 'cross-fetch/polyfill';
import { datesFromPeriod } from "../../../src/utils";

const baseUrl = process.env.TEST_URL || "";

describe("datesFromPeriod", function () {
    beforeEach(() => jest.setTimeout(10 * 1000))

    it("works", async function () {
        const ssdName = "Meppelerdiep_10min";
        const apiEndpoint = "ssd";
        const provider = new SsdWebserviceProvider(baseUrl);
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const yesterday = date.toISOString().split("T")[0];
        const url = baseUrl + apiEndpoint + "?request=GetDisplay&ssd=" + ssdName + "&time=" + yesterday + "T00:00:00Z";
        const svg = await provider.getSvg(url);

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
        addLeftClickAction(svg, callback);

        // now check the results
        let expectedCallbacks = 0;
        svg.querySelectorAll<SVGElement>('*').forEach(function (el) {
            const style = el.style;
            if (el.hasAttributeNS(FEWS_NAMESPACE, 'click')) {
                // simulate a click
                const event = new Event('click', { bubbles: true, cancelable: false})
                el.dispatchEvent(event);
                expectedCallbacks += 1;
                expect(style.cursor).toEqual('pointer');
            }
        });
        expect(callbackCounter).toEqual(expectedCallbacks);
    })

    it("works for 1 minute period strings", function () {
        const start = "2021-01-01T08:50:00Z";
        const end = "2021-01-01T09:10:00Z";
        const period = start + "/" + end + "/PT1M";
        const dates = datesFromPeriod(period);
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
        const dates = datesFromPeriod(period);
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
        const dates = datesFromPeriod(period);
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
        const dates = datesFromPeriod(period);
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
        const dates = datesFromPeriod(period);
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
        const dates = datesFromPeriod(period);
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
