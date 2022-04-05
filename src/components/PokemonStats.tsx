import {  FC, Ref, MouseEvent, useRef, useState, Fragment } from "react"
import { IPokemonStat } from "../interfaces/pokemon"
import { FaPlay } from "react-icons/fa"

export interface IPokemonStatsProps {
  readonly stats?: IPokemonStat[]
}

const PokemonStats: FC<IPokemonStatsProps> = ({ stats }: IPokemonStatsProps) => {
  const [infoCard, setInfoCard] = useState({ name: "", isDisplayed: false })
  const ulRefs = useRef<HTMLUListElement[]>([])

  const openStatInfoCard = (event: MouseEvent<SVGElement>) => {
    const currentTarget = event.currentTarget
    const strongTag = currentTarget.previousSibling
    const statName = strongTag?.textContent as string
    const index = ulRefs.current.findIndex(({ id }) => id === statName)
    const { width } = strongTag?.parentElement?.getBoundingClientRect() as DOMRect
    const { left } = currentTarget?.getBoundingClientRect() as DOMRect

    if (ulRefs.current[index]) {
      ulRefs.current[index].style.zIndex = "2"
      ulRefs.current[index].style.left = `${event.clientX - left + width}px`
    }

    setInfoCard({ 
      name: infoCard.name === statName ? "" : statName, 
      isDisplayed: infoCard.name === statName ? false : true
    })
  }

  return <ul style={{ margin: "0 0 2rem 5rem", minWidth: "13rem" }}>
    {
      stats?.map(({ name, base_stat, effort }, index) => <Fragment key={ `${name}${base_stat}` }>
        <div id={ name }>
            <strong>
              { name }
            </strong>

            <FaPlay 
              onClick={ openStatInfoCard } 
              style={
                infoCard.name === name && infoCard.isDisplayed ? 
                  {} : { opacity: "0.3" } 
              }
            />
        </div>

        <ul 
          id={ name }
          ref={ self => ulRefs.current[index] = self as HTMLUListElement } 
          style={
            infoCard.name === name && infoCard.isDisplayed ? 
              { zIndex: "2" } : { zIndex: "2", display: "none" }
          }
        >
          <li>base_stat: { base_stat }</li>
          <li>effort: { effort }</li>
        </ul>
      </Fragment>
      )
    }
  </ul>
}

export default PokemonStats