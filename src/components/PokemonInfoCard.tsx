import { 
  IPokemonAbilities, 
  IPokemonMoves, 
  IPokemonStat, 
  IPokemonStats, 
  IPokemonTypes 
} from "../interfaces/pokemon"
import { MouseEvent, useState, FC } from "react"
import OverlappingInfoCard from "./OverlappingInfoCard"
import PokemonTypes from "./PokemonTypes"
import PokemonMoves from "./PokemonMoves"
import PokemonAbilities from "./PokemonAbilities"
import PokemonStats from "./PokemonStats"

interface IPokemonInfoCardProps {
  readonly types: IPokemonTypes
  readonly moves: IPokemonMoves
  readonly abilities: IPokemonAbilities
  readonly stats: IPokemonStats
}

export type InfoCard = {
  readonly name: string
  readonly isDisplayed: boolean
}

export default function PokemonInfoCard({
  types, moves, abilities, stats
}: IPokemonInfoCardProps) {
  const [infoCard, setInfoCard] = useState<InfoCard>({
    name: "",
    isDisplayed: false,
  })

  const [pokemonMovesStyle, setPokemonMovesStyle] = useState({})

  const pokemonTypesComponent = PokemonTypes.name
  const pokemonMovesComponent = PokemonMoves.name
  const pokemonAbilitiesComponent = PokemonAbilities.name
  const pokemonStatsComponent = PokemonStats.name
  const infoCardName = infoCard.name
  const infoCardIsDisplayed = infoCard.isDisplayed

  const openPokemonInfoCard = (event: MouseEvent<SVGElement>) => {
    const strongTag = event.currentTarget.parentElement
    const pokemonInfoCard = strongTag?.parentElement
    const arrayWithComponentName = pokemonInfoCard?.className
      .match(/\s(\w*)/) as RegExpMatchArray
    const componentName = arrayWithComponentName[1]
    const { top } = pokemonInfoCard?.getBoundingClientRect() as DOMRect

    setPokemonMovesStyle({ top: event.clientY - top })
    setInfoCard(({ name, isDisplayed }) => ({
      isDisplayed: name === componentName ? !isDisplayed : true,
      name: componentName
    }))
  }

  return <>
    <OverlappingInfoCard 
      label="types" 
      props={{ types }}
      infoCard={ infoCard }
      Component={ PokemonTypes as FC<{}> }
      openInfoCard={ openPokemonInfoCard }
      openInfo={ infoCardName === pokemonTypesComponent && infoCardIsDisplayed } 
    />

    <OverlappingInfoCard 
      label="moves" 
      props={{ moves, style: pokemonMovesStyle }}
      infoCard={ infoCard }
      Component={ PokemonMoves as FC<{}> }
      openInfoCard={ openPokemonInfoCard }
      openInfo={ infoCardName === pokemonMovesComponent && infoCardIsDisplayed } 
    />

    <OverlappingInfoCard 
      label="abilities" 
      props={{ abilities }} 
      infoCard={ infoCard }
      Component={ PokemonAbilities as FC<{}> }
      openInfoCard={ openPokemonInfoCard }
      openInfo={ infoCardName === pokemonAbilitiesComponent && infoCardIsDisplayed } 
    />
    
    <OverlappingInfoCard 
      label="stats" 
      props={{ stats }}
      infoCard={ infoCard }
      Component={ PokemonStats as FC<{}> }
      openInfoCard={ openPokemonInfoCard }
      openInfo={ infoCardName === pokemonStatsComponent && infoCardIsDisplayed } 
    />
  </>
}