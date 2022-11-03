/*
    In most cases, testing with live devices is impractical due to the unpredictability of incoming data.
    The first step to automating tests that rely on data uploads is understanding the exact format and 
    frequency of data that will be received from the device. Knowing that, we will be able to generate a similar, 
    but predictable payload.

    In the example below, we will create a new device and generate a payload equivalent to 1 datapoint every 30 seconds
    for the past 10 hours.
*/
import { test, expect } from "../fixtures";
import { Device, IotPayload } from "../types";

let device: Device;
const metric = {
  name: "43040_100",
  desc: "memory",
};

test.describe("Uploading data", () => {
  test.beforeAll(async ({ testDevice, apiUtils }) => {
    device = testDevice;
    const dataPayload: IotPayload = [];
    const currentTime = Date.now();
    /* Generate a payload of 1200 datapoints
       https://www.developer.davra.com/api/#the-datapoint-object */
    for (let i = 0; i < 1200; i++) {
      dataPayload.push({
        UUID: testDevice.UUID,
        name: metric.name,
        msg_type: "datum",
        value: i + 1,
        timestamp: currentTime - i * 30000, // 30 seconds between datapoints
      });
    }
    // Give the device 5 seconds before sending data
    await apiUtils.delay(5000);
    /* Use apiUtils to send data in three chunks: 500, 500 and 200 */
    await apiUtils.sendData(dataPayload);
  });

  test.afterAll(async ({ apiUtils }) => {
    /* If deleting all 43040_100 datapoints interferes with other tests, you can
       delete all data during global teardown instead */
    await apiUtils.deleteData(metric.name);
  });

  test("Average value for uploaded metric", async ({ page }) => {
    const detailsPage = page.objects.deviceDetailsPage;
    await detailsPage.goto(`/#/device/${device.UUID}`);
    await detailsPage.selectTab("DATA");
    // 43040_100 is interpreted as 'Memory'
    await detailsPage.metricDropdown.selectOption("Memory");
    // Average of uploaded values should be 600.5
    await expect(detailsPage.metricText).toContainText("600.5");
  });
});
