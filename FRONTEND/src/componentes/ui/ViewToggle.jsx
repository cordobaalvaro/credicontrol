"use client"
import { IconLayoutGrid, IconList } from "@tabler/icons-react"
import "./ViewToggle.css"
const ViewToggle = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="view-toggle">
      <button
        className={`view-toggle-btn ${viewMode === "cards" ? "active" : ""}`}
        onClick={() => onViewModeChange("cards")}
        title="Vista de tarjetas"
      >
        <IconLayoutGrid />
      </button>
      <button
        className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
        onClick={() => onViewModeChange("list")}
        title="Vista de lista"
      >
        <IconList />
      </button>
    </div>
  )
}
export default ViewToggle
