import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 9000,
  IpGeoLocationKey: process.env.IpGeoLocationKey,
};

export default config;
