import type { Course } from "./api"

export function formatPrice(country: string | null, course: Course): string {
  if (country === "IN") {
    return formatRupees(course.pricePaise)
  }
  if (country === "US") {
    return formatDollars(course.priceUsdCents)
  }
  return `${formatRupees(course.pricePaise)} / ${formatDollars(course.priceUsdCents)}`
}

export function priceBaseValue(course: Course, country: string | null): number {
  if (country === "US") {
    return course.priceUsdCents
  }
  return course.pricePaise
}

function formatRupees(paise: number): string {
  return (paise / 100).toLocaleString("en-IN", { style: "currency", currency: "INR" })
}

function formatDollars(cents: number): string {
  return (cents / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })
}
