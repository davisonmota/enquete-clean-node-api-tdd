import { SaveSurveyResultController } from './save-survey-result-controller'
import { HttpRequest, LoadSurveysById, SurveyModel } from './save-survey-result-controller-protocols'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden } from '@/presentation/helpers/http/http-helper'

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeFakeRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  }
})

const makeLoadSurveyById = (): LoadSurveysById => {
  class LoadSurveysByIdStub implements LoadSurveysById {
    async loadById (id: string): Promise<SurveyModel> {
      return await new Promise(resolve => resolve(makeFakeSurvey()))
    }
  }
  return new LoadSurveysByIdStub()
}
type SutTypes = {
  loadSurveysByIdStub: LoadSurveysById
  sut: SaveSurveyResultController
}

const makeSut = (): SutTypes => {
  const loadSurveysByIdStub = makeLoadSurveyById()
  const sut = new SaveSurveyResultController(loadSurveysByIdStub)
  return {
    loadSurveysByIdStub,
    sut
  }
}

describe('SaveSurveyResultController', () => {
  test('Should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveysByIdStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveysByIdStub, 'loadById')
    await sut.handle(makeFakeRequest())
    expect(loadByIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveysByIdStub } = makeSut()
    jest.spyOn(loadSurveysByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
})
