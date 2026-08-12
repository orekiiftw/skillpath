const COURSES_URL = "https://syncsphere-hiv6.onrender.com/assignment/course-data"
const COUNTRY_URL = "https://syncsphere-hiv6.onrender.com/assignment/country-code"

export type Course = {
  courseName: string
  courseCode: string
  description: string
  mainCategory: string
  shortCourse: string
  courseType: string
  pricePaise: number
  priceUsdCents: number
  mangoId: string
  refundable: boolean
}

export type CountryData = {
  country_code: string
}

export async function fetchCourses(): Promise<Course[]> {
  const response = await fetch(COURSES_URL, { signal: AbortSignal.timeout(10000) })
  if (!response.ok) {
    throw new Error(`Course request failed with ${response.status}`)
  }
  return response.json()
}

export async function fetchCountry(): Promise<CountryData> {
  const response = await fetch(COUNTRY_URL, { signal: AbortSignal.timeout(10000) })
  if (!response.ok) {
    throw new Error(`Country request failed with ${response.status}`)
  }
  return response.json()
}
