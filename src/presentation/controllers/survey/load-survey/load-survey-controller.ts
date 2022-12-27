import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-survey-controller-protocols'
import { ok, serverError } from '../../../helpers/http/http-helper'
export class LoadSurveyController implements Controller {
  constructor (
    private readonly loadSurvey: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurvey.load()
      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
