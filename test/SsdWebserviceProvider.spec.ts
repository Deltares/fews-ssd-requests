import {SsdWebserviceProvider} from '../src/SsdWebserviceProvider'

const exclude = {
  displayGroups: []
}

describe("ssd", function() {
  it("stores the base url on creation", function() {
    const url = "https://rwsos.webservices.deltares.nl/iwp/";
    const provider = new SsdWebserviceProvider(url, exclude);
    expect(provider.getUrl()).toEqual(url);
  });

  it("adds a trailing slash to the base url on creation", function() {
    const url = "https://rwsos.webservices.deltares.nl/iwp";
    const provider = new SsdWebserviceProvider(url, exclude);
    expect(provider.getUrl()).toEqual(url + '/');
  });
});

