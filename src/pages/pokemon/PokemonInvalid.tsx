import PokemoNavigationButtons from "../../components/pokemon/PokemonNavigation"
import GoToHome from "../..//components/GoToHome"

interface IPokemonInvalid {
  readonly id: string
}

export default function PokemonInvalid({ id }: IPokemonInvalid) {
  return <>
    <GoToHome />

    <div className="error-page">
      <h1>Cannot get pokemon data with id #{ id }</h1>
    </div>

    <PokemoNavigationButtons />
  </>
}
