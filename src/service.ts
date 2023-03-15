import { Database, domainType } from "./database";
import { IpGeoLocation } from "./ipgeolocation";
import { CustomError } from "./utils";

export class Service {
  constructor(
    private database: Database,
    private ipGeoLocation: IpGeoLocation
  ) {}

  async getDomain(id: number): Promise<domainType> {
    const domainRecord = this.database.getById(id);

    if (!domainRecord) {
      throw CustomError.NotFoundError("Domain not found");
    }

    return domainRecord;
  }

  async getDomainByName(domain: string): Promise<domainType> {
    const domainRecord = this.database.getByDomain(domain);

    if (!domainRecord) {
      throw CustomError.NotFoundError("Domain not found");
    }

    return domainRecord;
  }

  async getAllActiveDomains(): Promise<domainType[]> {
    return this.database.getActiveDomains();
  }

  async saveDomain(domain: string): Promise<domainType> {
    const domainRecord = this.database.getByDomain(domain);

    if (domainRecord) {
      throw CustomError.BadRequest("Domain already exists");
    }

    const domainData = await this.ipGeoLocation.getGeoLocation(domain);
    if (!domainData) {
      throw CustomError.BadRequest(
        `An error occurred while fetching data for ${domain}`
      );
    }

    return this.database.add({
      domain,
      long: domainData.longitude,
      lat: domainData.latitude,
      geonameId: domainData.geoname_id,
      isActive: true,
    });
  }

  async updateDomain(id: number): Promise<domainType> {
    const domainRecord = this.database.getById(id);

    if (!domainRecord) {
      throw CustomError.NotFoundError("Domain not found");
    }

    const domainData = await this.ipGeoLocation.getGeoLocation(
      domainRecord.domain
    );

    if (!domainData) {
      throw CustomError.BadRequest(
        `An error occurred while fetching data for ${domainRecord.domain}`
      );
    }

    return this.database.update(id, {
      domain: domainRecord.domain,
      long: domainData.longitude,
      lat: domainData.latitude,
      geonameId: domainData.geoname_id,
      isActive: true,
    });
  }

  deactivateDomain(id: number): boolean {
    const domainRecord = this.database.getById(id);

    if (!domainRecord) {
      throw CustomError.NotFoundError("Domain not found");
    }

    return this.database.deactivate(id);
  }
}
