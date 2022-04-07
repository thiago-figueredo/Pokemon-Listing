import GoToHome from "../components/GoToHome"

export default function ErrorPage() {
  return <>
    <GoToHome />

    <div className="error-page">
      <h1>This Route was not found</h1>
    </div>
  </>
}
