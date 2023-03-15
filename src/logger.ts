import { AxiosError } from "axios";

export class Logger {
  constructor(private namespace: string) {}

  log(message: string) {
    console.log(`[${this.namespace}] ${message}`);
  }

  error(message: string | Error) {
    const m = message instanceof Error ? message.message : message;
    console.error(`[${this.namespace}] ${m}`);
  }

  beautifyAxiosError(error: AxiosError) {
    const e = {
      message: error.message,
      status: error.response?.status,
      apiMessage: error.response?.data,
    };
    console.error(`${this.namespace} ${JSON.stringify(e, null, 2)}`);
  }
}
