import { createRoot } from "react-dom/client"
import SkillpathCourses from "./SkillpathCourses"

const container = document.getElementById("root")
const root = createRoot(container as HTMLElement)

root.render(<SkillpathCourses sectionTitle="Explore courses" accentColor="#4F46E5" />)
