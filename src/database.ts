export type domainType = {
  domain: string;
  long: string;
  lat: string;
  geonameId: string;
  isActive: boolean;
};

export class Database {
  private records: (domainType & { id: number })[] = [];

  add(domain: domainType) {
    this.records.push({
      id: this.records.length + 1,
      ...domain,
    });

    return this.records[this.records.length - 1];
  }

  deactivate(id: number): boolean {
    const domain = this.records.find((d) => d.id === id);
    if (domain) {
      domain.isActive = false;
    }

    return !!domain;
  }

  getByDomain(domain: string): domainType | undefined {
    return this.records.find(
      (d) => d.domain.toLowerCase() === domain.toLowerCase()
    );
  }

  getActiveDomains(): domainType[] {
    return this.records.filter((d) => d.isActive);
  }

  getById(id: number): domainType | undefined {
    return this.records.find((d) => d.id === id);
  }

  update(id: number, domain: domainType): domainType | undefined {
    const domainRecord = this.records.find((d) => d.id === id);
    if (domainRecord) {
      domainRecord.long = domain.long;
      domainRecord.lat = domain.lat;
      domainRecord.geonameId = domain.geonameId;
      domainRecord.isActive = domain.isActive;
    }

    return domainRecord;
  }
}
