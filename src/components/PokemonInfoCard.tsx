import { 
  IPokemonAbilities, 
  IPokemonMoves, 
  IPokemonStats, 
  IPokemonTypes 
} from "../interfaces/pokemon"
import { MouseEvent, useState } from "react"
import PokemonTypes from "./PokemonTypes"
import PokemonMoves from "./PokemonMoves"
import PokemonAbilities from "./PokemonAbilities"
import PokemonStats from "./PokemonStats"
import PokemonInfoCardHelper from "./PokemonInfoCardHelper"

interface IPokemonInfoCardProps {
  readonly types: IPokemonTypes
  readonly moves: IPokemonMoves
  readonly abilities: IPokemonAbilities
  readonly stats: IPokemonStats
}

interface IOverlappingInfoCard {
  readonly isDisplayed: boolean
  readonly name: string
}

export default function PokemonInfoCard({
  types, moves, abilities, stats
}: IPokemonInfoCardProps) {
  const [overlappingInfoCard, setOverlappingInfoCard] = useState<IOverlappingInfoCard>({
    isDisplayed: false,
    name: "",
  })

  const pokemonTypesComponent = PokemonTypes.name
  const pokemonMovesComponent = PokemonMoves.name
  const pokemonAbilitiesComponent = PokemonAbilities.name
  const pokemonStatsComponent = PokemonStats.name
  const overlappingInfoCardName = overlappingInfoCard.name
  const overlappingInfoCardIsDisplayed = overlappingInfoCard.isDisplayed

  const openPokemonInfoCard = ({ currentTarget }: MouseEvent<SVGElement>) => {
    const strongTag = currentTarget.parentElement
    const pokemonInfoCard = strongTag?.parentElement
    const arrayWithComponentName = pokemonInfoCard?.className
      .match(/pokemon-info-card (.*)/) as RegExpMatchArray
    const componentName = arrayWithComponentName[1]

    setOverlappingInfoCard(({ name, isDisplayed}) => ({
      isDisplayed: name === componentName ?  !isDisplayed : true,
      name: componentName
    }))
  }

  return <>
    <div className={ `pokemon-info-card ${pokemonTypesComponent}` }>
      <PokemonInfoCardHelper 
        label="types" 
        openInfo={ 
          overlappingInfoCardName === pokemonTypesComponent &&
            overlappingInfoCardIsDisplayed
        } 
        openPokemonInfoCard={ openPokemonInfoCard }
      />

      { 
        overlappingInfoCardName === pokemonTypesComponent && 
          overlappingInfoCardIsDisplayed && <PokemonTypes types={ types } /> 
      }
    </div>

    <div className={ `pokemon-info-card ${pokemonMovesComponent}` }>
      <PokemonInfoCardHelper 
        label="moves" 
        openInfo={ 
          overlappingInfoCardName === pokemonMovesComponent &&
            overlappingInfoCardIsDisplayed
        } 
        openPokemonInfoCard={ openPokemonInfoCard }
      />

      { 
        overlappingInfoCardName === pokemonMovesComponent && 
          overlappingInfoCardIsDisplayed && <PokemonMoves moves={ moves } /> 
      }
    </div>

    <div className={ `pokemon-info-card ${pokemonAbilitiesComponent}` }>
      <PokemonInfoCardHelper 
        label="abilities" 
        openInfo={ 
          overlappingInfoCardName === pokemonAbilitiesComponent &&
            overlappingInfoCardIsDisplayed 
        } 
        openPokemonInfoCard={ openPokemonInfoCard }
      />

      { 
        overlappingInfoCardName === pokemonAbilitiesComponent && 
          overlappingInfoCardIsDisplayed &&  
            <PokemonAbilities abilities={ abilities } /> 
      }
    </div>

    <div className={ `pokemon-info-card ${pokemonStatsComponent}` }>
      <PokemonInfoCardHelper 
        label="stats" 
        openInfo={ 
          overlappingInfoCardName === pokemonStatsComponent &&
            overlappingInfoCardIsDisplayed
        } 
        openPokemonInfoCard={ openPokemonInfoCard }
      />

      { 
        overlappingInfoCardName === pokemonStatsComponent && 
          overlappingInfoCardIsDisplayed && <PokemonStats stats={ stats } /> 
      }
    </div>
  </>
}