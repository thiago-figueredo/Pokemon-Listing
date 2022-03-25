import { 
  IPokemon, 
  IPokeApiPokemon,
  IPokeApiResponse, 
} from "./interfaces/pokemon"
import { useRef, useCallback, useEffect, useState, MouseEvent } from "react"
import PokemonModal from "./components/PokemonModal"
import Pokemon from './components/Pokemon'
import Header from "./components/Header"

export interface IPokemonState {
  readonly pokemons: IPokemon[]
  readonly previousPokemonsUrl: string
  readonly nextPokemonsUrl: string
  readonly displayPokemonModal: boolean
}

export const initialState: IPokemonState = {
  pokemons: [],
  previousPokemonsUrl: "",
  nextPokemonsUrl: "",
  displayPokemonModal: false
}

export default function App() {
  const pokemonUrl = "https://pokeapi.co/api/v2/pokemon"
  const pokemonModalRef = useRef<HTMLElement>()
  const [state, setState] = useState<IPokemonState>(initialState)
  const previousPokemonsUrl = state.previousPokemonsUrl
  const nextPokemonsUrl = state.nextPokemonsUrl
  const displayPokemonModal = state.displayPokemonModal

  const getJSON = async (url: string) => {
    const response = await fetch(url)
    return response.json()
  }

  const getPokemonImage = useCallback(async (
    id: number,
    url = "https://pokeapi.co/api/v2/pokemon-form"
  ) => {
    try {
        const { sprites } = await getJSON(`${url}/${id}`)
        const imageSourceUrl = sprites["front_default"]
        const response = await fetch(imageSourceUrl)
        const blob = await response.blob()
        const src = URL.createObjectURL(blob as Blob)

        return src
    } catch {}
  }, [])

  const loadPokemons = useCallback(async (url = pokemonUrl) => {
    try {
      const { results, next, previous }: IPokeApiResponse = await getJSON(url)
      const pokemons: IPokemon[] = await Promise.all(
        results.map(async ({ name, url }) => {
          const {
            id, moves, types, abilities, height, weight, stats
          }: IPokeApiPokemon = await getJSON(url)
          const src = await getPokemonImage(id) as string

          return {
            name, height, weight, id, src,
            types: types.map(({ type }) => type.name),
            moves: moves.map(({ move }) => move.name),
            abilities: abilities.map(({ ability }) => ability.name),
            stats: stats.map(({ base_stat, effort, stat }) => 
              ({ base_stat, effort, name: stat.name }))
          } 
        })
      )

      setState(oldState => ({
        ...oldState,
        pokemons, 
        nextPokemonsUrl: next, 
        previousPokemonsUrl: previous
      }) as IPokemonState)
    } catch {}
  }, [setState, getPokemonImage])

  const openPokemonModal = useCallback(({ 
    currentTarget 
  }: MouseEvent<HTMLElement>) => {
    const pokemonName = currentTarget.childNodes[0].firstChild?.textContent as string
    const id = state.pokemons.findIndex(({ name }) => name === pokemonName)

    currentTarget.id = id.toString()
    pokemonModalRef.current = currentTarget

    setState(oldState => ({ 
      ...oldState, 
      displayPokemonModal: true,
    }))
  }, [state.pokemons])

  const closePokemonModal = useCallback(() => {
    setState(oldState => ({ ...oldState, displayPokemonModal: false }))
  }, [])

  const pokemonProps = {
    openPokemonModal
  }

  const pokemon = state.pokemons[parseInt(pokemonModalRef.current?.id as string)]
  const pokemonModalProps = {
    ...pokemon,
    closePokemonModal
  }

  useEffect(() => {
    if (pokemonModalRef.current) {
      displayPokemonModal ? 
        pokemonModalRef.current.style.display = "none"  :
        pokemonModalRef.current.style.display =  "flex"
    }
  }, [displayPokemonModal])

  useEffect(() => {
    JSON.stringify(state) === JSON.stringify(initialState) && loadPokemons(pokemonUrl)
  })

  return <>
    <Header />

    <main id="pokemon">
      {
        state.pokemons.map((pokemon) => 
          <Pokemon key={ pokemon.id } { ...{ ...pokemon, ...pokemonProps } } />
        )
      }

      <div className="toggle-page">
        <button onClick={ () => previousPokemonsUrl && loadPokemons(previousPokemonsUrl) }>
          Previous
        </button>

        <button onClick={ () => nextPokemonsUrl && loadPokemons(nextPokemonsUrl) }>
          Next
        </button>
      </div>
    </main>

      { displayPokemonModal && <PokemonModal { ...pokemonModalProps } />}
  </> 
}