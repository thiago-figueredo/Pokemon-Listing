import { CSSProperties, FC, MouseEvent } from "react"
import { IPokemonStats } from "../interfaces/pokemon"
import { InfoCard } from "./PokemonInfoCard"
import { FaPlay } from "react-icons/fa"

export interface IOverlappingInfoCard {
  readonly name: string
  readonly isDisplayed: boolean
}

export interface IOverlappingInfoCardProps {
  readonly label: string
  readonly openInfo: boolean
  readonly Component: FC
  readonly infoCard: InfoCard
  readonly openInfoCard: (event: MouseEvent<SVGElement>) => void
  readonly props: { 
    readonly [key: string]: string[] | IPokemonStats | CSSProperties 
  }
}

export default function OverlappingInfoCard({ 
  label, openInfo, openInfoCard, Component, infoCard, props
}: IOverlappingInfoCardProps) {
  const componentName = Component.name

  return <div className={ `overlapping-info-card ${componentName}`}>
    <strong>
      { label }
      <FaPlay 
        onClick={ openInfoCard } 
        style={ openInfo ? {} : { opacity: "0.3" }}
      />
    </strong>

    { 
      infoCard.name === componentName && infoCard.isDisplayed 
        && <Component { ...props } /> 
    }
  </div>
}