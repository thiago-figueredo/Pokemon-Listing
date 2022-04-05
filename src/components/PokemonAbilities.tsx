import { FC } from "react"

export interface IPokemonAbilitiesProps {
  readonly abilities?: string[]
}

const PokemonAbilities: FC<IPokemonAbilitiesProps> = (
  { abilities }: IPokemonAbilitiesProps
) => {
  return <div>
    <ul style={{ minWidth: "10rem" }}>
      {
        abilities?.map((ability, index) => <li key={ index }>
          { ability }
        </li>)
      }
    </ul>
  </div>
}

export default PokemonAbilities