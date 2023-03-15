import express from "express";

export class CustomError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public isOperational = true
  ) {
    super(message);
    this.message = message;
    this.status = status;
  }

  static ValidationError(msg: string) {
    const err = new this(msg);
    err.status = 400;
    err.name = "Validation Error";
    return err;
  }

  static BadRequest(msg: string) {
    const err = new this(msg);
    err.status = 400;
    err.name = "Bad Request";
    return err;
  }

  static ForbiddenError(msg: string) {
    const err = new this(msg);
    err.status = 403;
    err.name = "Forbidden";
    return err;
  }

  static NotFoundError(msg: string) {
    const err = new this(msg);
    err.status = 404;
    err.name = "Not Found";
    return err;
  }

  static ConflictError(msg: string) {
    const err = new this(msg);
    err.status = 409;
    err.name = "Conflict Error";
    return err;
  }
}


export class Response {
  static success(res: express.Response, data: any) {
    return res.status(200).json({
      status: "success",
      data,
    });
  }

  static error(res: express.Response, error: CustomError) {
    return res.status(error.status).json({
      status: "error",
      message: error.message,
    });
  }
}
