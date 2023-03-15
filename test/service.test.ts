import { AxiosInstance } from "axios";
import { IpGeoLocationResponse, IpGeoLocation } from "src/ipgeolocation";
import { Service } from "../src/service";
import { Database, domainType } from "../src/database";
import { IpGeoLocationDummy } from "./data";

import assert from "assert";

const data: domainType & { id: number } = {
  id: 1,
  domain: "google.com",
  long: "-122.08421",
  lat: "37.42240",
  geonameId: "6301403",
  isActive: true,
};

class ipGeoLocation {
  private request = {
    get: (url: string) => {
      return Promise.resolve({
        data: IpGeoLocationDummy,
      });
    },
  } as unknown as AxiosInstance;

  async getGeoLocation(ip: string): Promise<IpGeoLocationResponse | null> {
    const { data } = await this.request.get("url");
    return data;
  }
}

const service = new Service(
  new Database(),
  new ipGeoLocation() as unknown as IpGeoLocation
);

describe("Service", function () {
  it("should add domain", async function () {
    const domain = await service.saveDomain("google.com");
    assert.deepEqual(domain, data);
  });

  it("should get domain by id", async function () {
    const domain = await service.getDomain(1);
    assert.deepEqual(domain, data);
  });

  it("should get domain by name", async function () {
    const domain = await service.getDomainByName("google.com");
    assert.deepEqual(domain, data);
  });

  it("should get all active domains", async function () {
    const domain = await service.getAllActiveDomains();
    assert.deepEqual(domain, [data]);
  });

  it("should update domain", async function () {
    const domain = await service.updateDomain(1);
    assert.deepEqual(domain, data);
  });

  it("should deactivate domain", function () {
    const success = service.deactivateDomain(1);
    assert.equal(success, true);
  });
});
