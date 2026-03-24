import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import PageLoading from "./PageLoading"
const RequireAuth = ({ children, rol: rolRequerido }) => {
    const { user, loading, isAuthenticated } = useAuth()
    if (loading) return <PageLoading />
    if (!isAuthenticated) return <Navigate to="/" replace />
    if (rolRequerido) {
        const rolesPermitidos = Array.isArray(rolRequerido) ? rolRequerido : [rolRequerido]
        if (!rolesPermitidos.includes(user.rol)) {
            return <Navigate to="/dashboard" replace />
        }
    }
    return children
}
export default RequireAuth
