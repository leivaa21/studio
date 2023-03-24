import { ErrorCodes } from "@studio/commons/dist/errors/ErrorCodes";
import { NextApiRequest, NextApiResponse } from "next";

export async function SafeControllerHandling(res: NextApiResponse, handler: () => Promise<any>) {
  try {
    await handler();
  }
  catch(someError) {
    if(typeof someError === 'object' && someError && (someError as {message: string}).message) {
      return res.status((someError as {apiStatus: number}).apiStatus).send({
        apiStatus: (someError as {apiStatus: number}).apiStatus,
        message: (someError as {message: string}).message,
        errorCode: (someError as {errorCode: string}).errorCode,
        kind: (someError as {kind: string}).kind
      })
    }

    return res.status(500).send({
      apiStatus: 500,
      message: someError,
      errorCode: ErrorCodes.InternalServerError,
      kind: 'INTERNAL_SERVER_ERROR'
    })
  }
}