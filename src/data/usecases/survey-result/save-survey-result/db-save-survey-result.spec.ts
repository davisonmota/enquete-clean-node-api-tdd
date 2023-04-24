import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository } from './db-save-survey-result-protocols'
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/data/test'
import { mockSurveyResultParams, mockSurveyResultModel, throwError } from '@/domain/test'
import { LoadSurveyResultRepository } from '../load-survey-result/db-load-survey-result-protocols'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyRepositoryStub: SaveSurveyResultRepository
  loadSurveyRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutTypes => {
  const saveSurveyRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyRepositoryStub = mockLoadSurveyResultRepository()
  const sut = new DbSaveSurveyResult(saveSurveyRepositoryStub, loadSurveyRepositoryStub)
  return {
    sut,
    saveSurveyRepositoryStub,
    loadSurveyRepositoryStub
  }
}

describe('DbSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyRepositoryStub, 'save')
    const surveyResultData = mockSurveyResultParams()
    await sut.save(surveyResultData)
    expect(saveSpy).toBeCalledWith(surveyResultData)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyRepositoryStub, 'save').mockImplementationOnce(throwError)
    const promise = sut.save(mockSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadBySurveyId')
    const surveyResultData = mockSurveyResultParams()
    await sut.save(surveyResultData)
    expect(loadBySurveyIdSpy).toBeCalledWith(surveyResultData.surveyId)
  })

  test('Should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyRepositoryStub, 'loadBySurveyId').mockImplementationOnce(throwError)
    const promise = sut.save(mockSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return a SurveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(mockSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
