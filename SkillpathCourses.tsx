import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"
import { fetchCourses, fetchCountry } from "./api"
import type { Course } from "./api"
import { formatPrice, priceBaseValue } from "./price"

const styles = `
.skillpath-section {
  width: 100%;
  box-sizing: border-box;
  padding: 48px 32px;
}

.skillpath-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.skillpath-header .skillpath-title {
  margin: 0;
}

.skillpath-title {
  margin: 0 0 16px;
  font-size: 32px;
  font-weight: 700;
}

.skillpath-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.skillpath-search {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  min-width: 200px;
}

.skillpath-sort {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.skillpath-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width: 1023px) {
  .skillpath-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 639px) {
  .skillpath-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

.skillpath-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
}

.skillpath-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.skillpath-category {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.skillpath-refundable {
  padding: 3px 8px;
  border: 1px solid #a7f3d0;
  border-radius: 999px;
  background: #ecfdf5;
  color: #047857;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.skillpath-course-name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.skillpath-description {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
  min-height: 3em;
  font-size: 14px;
  line-height: 1.5;
  color: #4b5563;
}

.skillpath-price {
  margin: auto 0 0;
  padding-top: 8px;
  font-size: 18px;
  font-weight: 700;
}

.skillpath-count {
  margin: 16px 0 0;
  font-size: 13px;
  color: #6b7280;
}

.skillpath-country-note {
  margin: 0 0 16px;
  font-size: 13px;
  color: #6b7280;
}

.skillpath-state-panel {
  padding: 48px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  text-align: center;
}

.skillpath-state-title {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
}

.skillpath-state-text {
  margin: 0 0 20px;
  font-size: 14px;
  color: #4b5563;
}

.skillpath-retry-button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.skillpath-skeleton {
  border-radius: 6px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: skillpath-shimmer 1.2s infinite;
}

.skillpath-skeleton-chip {
  width: 40%;
  height: 12px;
}

.skillpath-skeleton-title {
  width: 70%;
  height: 18px;
}

.skillpath-skeleton-line {
  width: 100%;
  height: 14px;
}

.skillpath-skeleton-price {
  width: 35%;
  height: 18px;
  margin-top: auto;
}

@keyframes skillpath-shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
`

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
        <style>{styles}</style>
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
        <style>{styles}</style>
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
        <style>{styles}</style>
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
      <style>{styles}</style>
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
