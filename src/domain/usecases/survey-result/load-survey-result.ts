import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyResult {
  load: (data: string) => Promise<SurveyResultModel>
}
