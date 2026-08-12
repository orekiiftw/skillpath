import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { fetchCourses, fetchCountry } from "./api"
import type { Course } from "./api"
import { formatPrice, priceBaseValue } from "./price"
import "./styles.css"

type Props = {
  sectionTitle?: string
  accentColor?: string
}

export default function SkillpathCourses({
  sectionTitle = "Explore courses",
  accentColor = "#4F46E5",
}: Props) {
  const [status, setStatus] = useState("loading")
  const [courses, setCourses] = useState<Course[]>([])
  const [country, setCountry] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [searchText, setSearchText] = useState("")
  const [sortOrder, setSortOrder] = useState("none")

  useEffect(() => {
    let cancelled = false

    async function loadCourses() {
      setStatus("loading")
      try {
        const data = await fetchCourses()
        if (cancelled) return
        setCourses(data)
        setStatus(data.length === 0 ? "empty" : "success")
      } catch {
        if (!cancelled) setStatus("error")
      }
    }

    async function loadCountry() {
      try {
        const data = await fetchCountry()
        if (!cancelled) setCountry(data.country_code)
      } catch {
        if (!cancelled) setCountry(null)
      }
    }

    loadCourses()
    loadCountry()

    return () => {
      cancelled = true
    }
  }, [retryCount])

  const handleRetry = () => setRetryCount(retryCount + 1)

  const handleSort = () => {
    if (sortOrder === "none") {
      setSortOrder("priceAsc")
    } else if (sortOrder === "priceAsc") {
      setSortOrder("priceDesc")
    } else {
      setSortOrder("none")
    }
  }

  let visibleCourses = courses
  const query = searchText.trim().toLowerCase()
  if (query !== "") {
    visibleCourses = courses.filter((course) => {
      const searchable =
        `${course.courseName} ${course.description} ${course.mainCategory}`.toLowerCase()
      return searchable.includes(query)
    })
  }
  if (sortOrder !== "none") {
    visibleCourses = [...visibleCourses].sort(
      (a, b) => priceBaseValue(a, country) - priceBaseValue(b, country)
    )
    if (sortOrder === "priceDesc") {
      visibleCourses.reverse()
    }
  }

  let sortLabel = "Sort by price"
  if (sortOrder === "priceAsc") {
    sortLabel = "Price: low to high"
  } else if (sortOrder === "priceDesc") {
    sortLabel = "Price: high to low"
  }

  if (status === "loading") {
    return (
      <section className="skillpath-section">
        <h2 className="skillpath-title">{sectionTitle}</h2>
        <div className="skillpath-grid" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((slot) => (
            <div key={slot} className="skillpath-card">
              <div className="skillpath-skeleton skillpath-skeleton-chip" />
              <div className="skillpath-skeleton skillpath-skeleton-title" />
              <div className="skillpath-skeleton skillpath-skeleton-line" />
              <div className="skillpath-skeleton skillpath-skeleton-line" />
              <div className="skillpath-skeleton skillpath-skeleton-price" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (status === "error") {
    return (
      <section className="skillpath-section" role="status">
        <h2 className="skillpath-title">{sectionTitle}</h2>
        <div className="skillpath-state-panel">
          <p className="skillpath-state-title">We could not load the courses</p>
          <p className="skillpath-state-text">
            The course service is having a moment. Please try again.
          </p>
          <button
            className="skillpath-retry-button"
            style={{ background: accentColor }}
            onClick={handleRetry}
          >
            Try again
          </button>
        </div>
      </section>
    )
  }

  if (status === "empty") {
    return (
      <section className="skillpath-section" role="status">
        <h2 className="skillpath-title">{sectionTitle}</h2>
        <div className="skillpath-state-panel">
          <p className="skillpath-state-title">No courses right now</p>
          <p className="skillpath-state-text">
            The catalog is empty at the moment. Please check back soon.
          </p>
          <button
            className="skillpath-retry-button"
            style={{ background: accentColor }}
            onClick={handleRetry}
          >
            Try again
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="skillpath-section">
      <header className="skillpath-header">
        <h2 className="skillpath-title">{sectionTitle}</h2>
        <div className="skillpath-controls">
          <input
            className="skillpath-search"
            type="search"
            placeholder="Search courses"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <button className="skillpath-sort" onClick={handleSort}>
            {sortLabel}
          </button>
        </div>
      </header>
      {country === null && (
        <p className="skillpath-country-note">
          We could not confirm your country, so prices show both currencies.
        </p>
      )}
      {visibleCourses.length === 0 ? (
        <div className="skillpath-state-panel" role="status">
          <p className="skillpath-state-title">No courses match your search</p>
        </div>
      ) : (
        <div className="skillpath-grid">
          {visibleCourses.map((course) => (
            <div key={course.courseCode} className="skillpath-card">
              <div className="skillpath-card-top">
                <span className="skillpath-category" style={{ color: accentColor }}>
                  {course.mainCategory}
                </span>
                {course.refundable && (
                  <span className="skillpath-refundable">Refundable</span>
                )}
              </div>
              <h3 className="skillpath-course-name">{course.courseName}</h3>
              <p className="skillpath-description">{course.description}</p>
              <p className="skillpath-price">{formatPrice(country, course)}</p>
            </div>
          ))}
        </div>
      )}
      <p className="skillpath-count">
        Showing {visibleCourses.length} of {courses.length} courses
      </p>
    </section>
  )
}

addPropertyControls(SkillpathCourses, {
  sectionTitle: {
    type: ControlType.String,
    title: "Section title",
    defaultValue: "Explore courses",
  },
  accentColor: {
    type: ControlType.Color,
    title: "Accent color",
    defaultValue: "#4F46E5",
  },
})
