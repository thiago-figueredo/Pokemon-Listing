import PokemoNavigationButtons from "../../components/Pokemon/Navigation"
import GoToHome from "../..//components/GoToHome"

export default function PokemonInvalid() {
  return <>
    <GoToHome />

    <div className="error-page">
      <h1>Cannot get pokemon</h1>
    </div>

    <PokemoNavigationButtons />
  </>
}
