import { MouseEventHandler, useState } from "react"
import { IPokemonStat } from "../interfaces/pokemon"
import { FaPlay } from "react-icons/fa"
import PokemonTypes from "./PokemonTypes"
import PokemonMoves from "./PokemonMoves"
import "../styles/pokemonModal.scss"

export interface IPokemonModalProps {
  readonly id: number
  readonly src: string
  readonly name: string
  readonly height: number
  readonly weight: number
  readonly abilities: string[]
  readonly types: string[]
  readonly moves: string[]
  readonly stats: IPokemonStat[]
  readonly closePokemonModal: MouseEventHandler<HTMLOrSVGElement>
}

export default function PokemonModal({ 
  name, weight, height, abilities, moves, types, src, stats, closePokemonModal
}: IPokemonModalProps) {
  const [state, setState] = useState({
    openPokemonTypeModal: false,
    openPokemonMoveModal: false
  })

  const openPokemonTypeModal = state.openPokemonTypeModal
  const openPokemonMoveModal = state.openPokemonMoveModal

  return <article id="pokemon-modal">
    <section className="image">
      <img id="pokemon" src={ src } alt={ name } />
      <img 
        id="close-modal"
        alt=""
        src="https://cdn-icons-png.flaticon.com/512/753/753345.png" 
        onClick={ closePokemonModal } 
      />
    </section>

    <section id="pokemon-info">
      <div>
        <strong>name: </strong>
        <span>{ name }</span>
      </div>

      <div>
        <strong>height: </strong>
        <span>{ height }</span>
      </div>

      <div>
        <strong>weight: </strong>
        <span>{ weight }</span>
      </div>

      <div id="pokemon-types">
        <strong>
          types<FaPlay 
            onClick={ 
              () => setState(
                oldState => ({ 
                  ...oldState, 
                  openPokemonTypeModal: !oldState.openPokemonTypeModal
                })
              ) 
            }

            style={ openPokemonTypeModal ? {} : { opacity: "0.9" }}
          />
        </strong>
        { openPokemonTypeModal && <PokemonTypes types={ types } /> }
      </div>

      <div id="pokemon-moves">
        <strong>
          moves<FaPlay 
            onClick={ 
              () => setState(
                oldState => ({ 
                  ...oldState, 
                  openPokemonMoveModal: !oldState.openPokemonMoveModal 
                })
              ) 
            }

            style={ openPokemonTypeModal ? {} : { opacity: "0.9" }}
          />
        </strong>
        { openPokemonMoveModal && <PokemonMoves moves={ moves } /> }
      </div>
    </section>
  </article> 
}