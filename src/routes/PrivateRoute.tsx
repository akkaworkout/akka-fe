import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore"

type Props = { children: React.ReactNode }

const PrivateRoute = ({ children }: Props) => {
    const { isLoggedIn } = useAuthStore();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}

export default PrivateRoute