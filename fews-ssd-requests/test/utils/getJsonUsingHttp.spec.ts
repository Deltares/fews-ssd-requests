import {getJsonUsingHttp} from '../../src/utils';

const url = "http://echo.jsontest.com/key/value/one/two";
interface ExampleFormat {
  key: string;
  one: string;
};
const example: ExampleFormat = {
  key: "value",
  one: "two"
};

describe("getJsonUsingHttp", function() {
  it("works for text", async function() {
    const promise = getJsonUsingHttp<ExampleFormat>(url);
    const response = await promise
    expect(response.status).toEqual(200)
    expect(response.parsedBody).toEqual(example)
  });
});
