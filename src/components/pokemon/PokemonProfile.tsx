import { useContext, useEffect, useState } from "react"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { IPokemon } from "../../interfaces/pokemon"
import PokemonContext from "../../context/PokemonContext"
import PokemonInvalid from "../../pages/pokemon/PokemonInvalid"
import GoToHome from "../GoToHome"
import "../../styles/pokemonProfile.scss"

export default function PokemonProfile() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { pokemonsLocalStorage } = useContext(PokemonContext)
  const [loadingPokemon, setLoadingPokemon] = useState(true)
  const byId = (pokemon: IPokemon) => pokemon.id === Number(id)
  const pokemon = pokemonsLocalStorage.find(byId) as IPokemon

  useEffect(() => { setLoadingPokemon(false) }, [])

  if (pokemon?.id !== Number(id)) return <PokemonInvalid id={ id as string} />

  return <>
    <GoToHome />

    {
      loadingPokemon ? 
        <section className="loading">
          <h3>Loading</h3>

          <div className="loading-dots">
            <h1 className="loading-effect">.</h1>
            <h1 className="loading-effect">.</h1>
            <h1 className="loading-effect">.</h1>
          </div>
        </section> : 

        <section className="pokemon-profile">
          <h2>{ pokemon?.name } #{ id }</h2>

          <article>
            <section className="image">
              <img id="pokemon" src={ pokemon?.image.large } alt="" />
            </section>

            <section id="pokemon-info">
              <div>
                <strong>height:&nbsp;</strong>
                <span>{ pokemon?.height }</span>
              </div>

              <div>
                <strong>weight:&nbsp;</strong>
                <span>{ pokemon?.weight }</span>
              </div>

              <section>
                <strong>types:</strong>
                { 
                  pokemon?.types.map(type => 
                    <p key={ id + type }>{ type }</p>) 
                }
              </section>

              <section>
                <strong>abilities:&nbsp;</strong>
                { 
                  pokemon?.abilities.map(ability => 
                    <p key={ id + ability }>{ ability }</p>) 
                }
              </section>
            </section>

            <section className="pokemon-stats">

            </section>
          </article> 

          <FaArrowLeft 
            className={ "go-back" } 
            onClick={ () => navigate(`/pokemon/${Number(id) - 1}`) }
          />

          <FaArrowRight 
            className={ "go-next" } 
            onClick={ () => navigate(`/pokemon/${Number(id) + 1}`) }
          />
        </section> 
    }
  </>
}
