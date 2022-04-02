import { Dispatch, FC, SetStateAction, MouseEvent } from "react"
import { IPokemonStat } from "../interfaces/pokemon"
import { IOverlappingInfoCard } from "./overlappingInfoCard"
import { FaPlay } from "react-icons/fa"

export interface IPokemonStatsProps {
  readonly stats?: IPokemonStat[]
  readonly overlappingInfoCard: IOverlappingInfoCard
  readonly setOverlappingInfoCard: Dispatch<SetStateAction<IOverlappingInfoCard>>
}

const PokemonStats: FC<IPokemonStatsProps> = ({ 
  stats, overlappingInfoCard, setOverlappingInfoCard
}: IPokemonStatsProps) => {
  const openStatInfoCard = ({ currentTarget }: MouseEvent<SVGElement>) => {
    const strongTag = currentTarget.parentElement
    const statName = strongTag?.parentElement?.id as string

    setOverlappingInfoCard({ name: statName, isDisplayed: true })
  }

  return <div>
    <ul>
      {
        stats?.map(({ name, base_stat, effort }, index) => <li 
          key={ index }
          id={ name }
        >
          <strong>
            { name }
            <FaPlay onClick={ openStatInfoCard }/>
          </strong>

          {
            overlappingInfoCard.name === name && 
              overlappingInfoCard.isDisplayed && 
                <li>
                  <ul>
                    <li>base_stat: { base_stat }</li>
                    <li>effort: { effort }</li>
                  </ul>
                </li>
          }
        </li>)
      }
    </ul>
  </div>
}

export default PokemonStats