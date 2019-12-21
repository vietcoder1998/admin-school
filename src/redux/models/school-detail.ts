export interface ISchoolDetail {
  id?: string,
  name?: string,
  shortName?: string,
  educatedScale?: number,
  website?: string,
  email?: string,
  phone?: string,
  historyDesc?: string,
  achievementDesc?: string,
  studyEnvDesc?: string,
  devStrategyDesc?: string,
  lecturersDesc?: string,
  logoUrl?: string,
  coverUrl?: string,
  region?: {
    id?: number,
    name?: string
  },
  address?: string,
  lat?: number,
  lon?: number,
  schoolType?: {
    id?: number,
    name?: string,
    priority?: number
  }
}