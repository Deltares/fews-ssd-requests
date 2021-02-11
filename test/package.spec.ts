// classes
import {SsdWebserviceProvider} from '../src';
// functions
import {datesFromPeriod} from '../src';
// interfaces
import {WebserviceProvider} from '../src';
import {ExcludeGroups} from '../src';
import {Capabilities} from '../src';
import {Action, ElementAction} from '../src';
import {Duration} from '../src';
import {FewsPiTimeSeriesResponse} from '../src';
import {addLeftClickAction} from '../src';
import {ClickCallbackFunction} from '../src';

describe("exports", function() {
  // note that interfaces cannot be tested in this way
  // the real test is the import statements above
  it("exports SsdWebserviceProvider", function() {
    expect(SsdWebserviceProvider).toBeDefined();
  });

  it("exports datesFromPeriod", function() {
    expect(datesFromPeriod).toBeDefined();
  });

  it("exports addLeftClickAction", function() {
    expect(addLeftClickAction).toBeDefined();
  });

});

