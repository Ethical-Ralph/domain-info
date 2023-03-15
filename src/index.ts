import express from "express";
import axios from "axios";
import { IpGeoLocation } from "./ipgeolocation";
import { Service } from "./service";
import { CustomError, Response } from "./utils";
import { Database } from "./database";
import config from "./config";

const app = express();

app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

const database = new Database();

const ipGeoLocationRequest = axios.create({
  baseURL: "https://api.ipgeolocation.io/",
});
const ipGeoLocation = new IpGeoLocation(ipGeoLocationRequest);

// dependency injection
const service = new Service(database, ipGeoLocation);

app.post("/domain", async (req, res) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      throw CustomError.ValidationError("Domain is required");
    }

    const domainRecord = await service.saveDomain(domain);

    Response.success(res, domainRecord);
  } catch (error) {
    Response.error(res, error);
  }
});

app.get("/domain/:identifier", async (req, res) => {
  const { identifier } = req.params;

  try {
    let domainRecord: any;

    if (isNaN(parseInt(identifier))) {
      domainRecord = await service.getDomainByName(identifier);
    } else {
      domainRecord = await service.getDomain(parseInt(identifier));
    }

    Response.success(res, domainRecord);
  } catch (error) {
    Response.error(res, error);
  }
});

app.get("/domains", async (req, res) => {
  try {
    const domainRecords = await service.getAllActiveDomains();

    Response.success(res, domainRecords);
  } catch (error) {
    Response.error(res, error);
  }
});

app.put("/domain/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const domainRecord = await service.updateDomain(parseInt(id));

    Response.success(res, domainRecord);
  } catch (error) {
    Response.error(res, error);
  }
});

app.delete("/domain/:id", (req, res) => {
  const { id } = req.params;

  try {
    const domainRecord = service.deactivateDomain(parseInt(id));

    Response.success(res, domainRecord);
  } catch (error) {
    Response.error(res, error);
  }
});

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
