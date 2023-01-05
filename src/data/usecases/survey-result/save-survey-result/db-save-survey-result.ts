import { SaveSurveyResultRepository, SaveSurveyResult, SaveSurveyResultParams, SurveyResultModel } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyRepository: SaveSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResult = await this.saveSurveyRepository.save(data)
    return surveyResult
  }
}
