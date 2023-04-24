import { Controller, HttpRequest, HttpResponse } from './load-survey-result-controller-protocols'
import { LoadSurveysById } from '../save-survey-result/save-survey-result-controller-protocols'

export class LoadSurveyResultController implements Controller {
  constructor (readonly loadSurveyById: LoadSurveysById) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { surveyId } = httpRequest.params
    await this.loadSurveyById.loadById(surveyId)
    return await Promise.resolve(null)
  }
}
