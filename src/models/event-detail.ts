export default interface IEventDetail  {
    id?: string,
    school?: {
      id?: string,
      name?: string,
      shortName?: string,
      educatedScale?: number,
      region?: {
        id?: number,
        name?: string
      },
      schoolType?: {
        id?: number,
        name?: string,
        priority?: number
      },
      email?: string,
      phone?: string,
      logoUrl?: string,
      address?: string,
      lat?: number,
      lon?: number,
      createdDate?: number
    },
    name?: string,
    description?: string,
    bannerUrl?: string,
    startedDate?: number,
    finishedDate?: number,
    createdDate?: number
  }