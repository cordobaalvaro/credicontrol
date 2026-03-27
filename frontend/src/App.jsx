import "./App.css"
import { HashRouter as Router } from "react-router-dom"
import AppRouter from "./AppRouter"
import { AuthProvider } from "./context/AuthContext"
import { NotificationProvider } from "./context/NotificationContext"
function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppRouter />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}
export default App
