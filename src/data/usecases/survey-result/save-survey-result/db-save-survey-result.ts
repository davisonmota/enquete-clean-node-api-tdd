import { LoadSurveyResultRepository } from '../load-survey-result/db-load-survey-result-protocols'
import { SaveSurveyResultRepository, SaveSurveyResult, SaveSurveyResultParams, SurveyResultModel } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyRepository: SaveSurveyResultRepository,
    private readonly loadSurveyRepository: LoadSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyRepository.save(data)
    const surveyResult = await this.loadSurveyRepository.loadBySurveyId(data.surveyId)
    return surveyResult
  }
}
