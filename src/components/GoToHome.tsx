import { useNavigate } from "react-router-dom"
import { FaBars } from "react-icons/fa"

export default function GoToHome() {
  const navigate = useNavigate()

  return (
    // <div className="home">
    //   <span>Home</span>
    // </div>
    <FaBars className="home" onClick={ () => navigate("/") } />
  )
}
