import { Controller, HttpRequest, HttpResponse, LoadSurveys } from './load-survey-controller-protocols'

export class LoadSurveyController implements Controller {
  constructor (
    private readonly loadSurvey: LoadSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurvey.load()
    return null
  }
}
