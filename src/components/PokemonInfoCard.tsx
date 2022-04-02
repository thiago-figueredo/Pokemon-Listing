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

export default function PokemonInfoCard({
  types, moves, abilities, stats
}: IPokemonInfoCardProps) {
  const [overlappingInfoCard, setOverlappingInfoCard] = useState({
    isDisplayed: false,
    name: "",
  })

  const [pokemonMovesStyle, setPokemonMovesStyle] = useState({})

  const pokemonTypesComponent = PokemonTypes.name
  const pokemonMovesComponent = PokemonMoves.name
  const pokemonAbilitiesComponent = PokemonAbilities.name
  const pokemonStatsComponent = PokemonStats.name
  const overlappingInfoCardName = overlappingInfoCard.name
  const overlappingInfoCardIsDisplayed = overlappingInfoCard.isDisplayed
  const pokemonStatsProps = { stats, overlappingInfoCard, setOverlappingInfoCard }

  const openPokemonInfoCard = (event: MouseEvent<SVGElement>) => {
    const strongTag = event.currentTarget.parentElement
    const pokemonInfoCard = strongTag?.parentElement
    const arrayWithComponentName = pokemonInfoCard?.className
      .match(/pokemon-info-card (.*)/) as RegExpMatchArray
    const componentName = arrayWithComponentName[1]
    const { top } = pokemonInfoCard?.getBoundingClientRect() as DOMRect

    setPokemonMovesStyle({ top: event.clientY - top })
    setOverlappingInfoCard(({ name, isDisplayed }) => ({
      isDisplayed: name === componentName ? !isDisplayed : true,
      name: componentName
    }))
  }

  return <>
    <div className={ `pokemon-info-card ${pokemonTypesComponent}` }>
      <PokemonInfoCardHelper 
        label="types" 
        openPokemonInfoCard={ openPokemonInfoCard }
        openInfo={ 
          overlappingInfoCardName === pokemonTypesComponent &&
            overlappingInfoCardIsDisplayed
        } 
      />

      { 
        overlappingInfoCardName === pokemonTypesComponent && 
          overlappingInfoCardIsDisplayed && <PokemonTypes types={ types } /> 
      }
    </div>

    <div className={ `pokemon-info-card ${pokemonMovesComponent}` }>
      <PokemonInfoCardHelper 
        label="moves" 
        openPokemonInfoCard={ openPokemonInfoCard }
        openInfo={ 
          overlappingInfoCardName === pokemonMovesComponent &&
            overlappingInfoCardIsDisplayed
        } 
      />

      { 
        overlappingInfoCardName === pokemonMovesComponent && 
          overlappingInfoCardIsDisplayed && 
            <PokemonMoves 
              moves={ moves } 
              style={ pokemonMovesStyle }
            /> 
      }
    </div>

    <div className={ `pokemon-info-card ${pokemonAbilitiesComponent}` }>
      <PokemonInfoCardHelper 
        label="abilities" 
        openPokemonInfoCard={ openPokemonInfoCard }
        openInfo={ 
          overlappingInfoCardName === pokemonAbilitiesComponent &&
            overlappingInfoCardIsDisplayed 
        } 
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
        openPokemonInfoCard={ openPokemonInfoCard }
        openInfo={ 
          overlappingInfoCardName === pokemonStatsComponent &&
            overlappingInfoCardIsDisplayed
        } 
      />

      { 
        overlappingInfoCardName === pokemonStatsComponent && 
          overlappingInfoCardIsDisplayed && 
            <PokemonStats { ...pokemonStatsProps } /> 
      }
    </div>
  </>
}