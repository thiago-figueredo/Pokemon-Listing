import { 
  MutableRefObject, 
  CSSProperties, 
  createContext, 
  MouseEvent, 
  ReactNode, 
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  useCallback
} from "react"
import { IPokemon, IPokeApiPokemon } from "../interfaces/pokemon"
import { IPokeApiResponse } from "../interfaces/pokemon"

export interface IPokemonModal {
  readonly display: boolean
  readonly style: CSSProperties
}

export interface IPokemonState {
  readonly pokemons: IPokemon[]
  readonly previousPokemonsUrl: string
  readonly nextPokemonsUrl: string
  readonly pokemonModals: IPokemonModal[]
  readonly loadingPokemons: boolean
}

export interface IPokemonContext {
  readonly state: IPokemonState
  readonly pokemonSectionRefs: MutableRefObject<HTMLElement[]>

  readonly setState: Dispatch<SetStateAction<IPokemonState>>
  readonly loadPokemonsData: Promise<IPokemonState | IPokeApiResponse>
  readonly getPreviousPokemons: Function
  readonly getNextPokemons: Function
  readonly openPokemonModal: Function
  readonly closePokemonModal: Function
}

export const initialState: IPokemonState = {
  pokemons: [],
  loadingPokemons: true,
  pokemonModals: Array(20),
  previousPokemonsUrl: "",
  nextPokemonsUrl: "",
}

const initialContextState = { 
  state: initialState, 
  setState: (oldState: IPokemonState) => {},
  pokemonSectionRefs: { current: [] as HTMLElement[] },
  loadPokemonsData: async () => ({}),
  getPreviousPokemons: () => {},
  getNextPokemons: () => {},
  openPokemonModal: ({ currentTarget }: MouseEvent<HTMLElement>) => {},
  closePokemonModal: ({ currentTarget }: MouseEvent<HTMLElement>) => {},
}

const PokemonContext = createContext<typeof initialContextState>(initialContextState)

interface IPokemonContextProviderProps {
  readonly children: ReactNode
}

const getJSON = async (url: string) => {
  const response = await fetch(url)
  return response.json()
}

const getPokemonImage = async (
  id: number,
  url: string = "https://pokeapi.co/api/v2/pokemon-form"
) => {
  try {
    const { sprites } = await getJSON(`${url}/${id}`)
    const imageSourceUrl = sprites["front_default"]
    const response = await fetch(imageSourceUrl)
    const blob = await response.blob()
    const src = URL.createObjectURL(blob as Blob)

    return src
  } catch {
    return ""
  }
}

export function PokemonContextProvider(
  { children }: IPokemonContextProviderProps
) {
  const pokemonSectionRefs = useRef<HTMLElement[]>([])
  const [state, setState] = useState<IPokemonState>(initialState as IPokemonState)
  const { previousPokemonsUrl, nextPokemonsUrl } = state

  const loadPokemonsData = useCallback(
    async (url = "https://pokeapi.co/api/v2/pokemon") => {
      try {
        const { results, next, previous }: IPokeApiResponse = await getJSON(url)
        const getPokemon = async ({ name, url }: IPokeApiPokemon) => {
          const {
            id, moves, types, abilities, height, weight, stats
          }: IPokeApiPokemon = await getJSON(url)
          const src = await getPokemonImage(id) as string

          return {
            name, height, weight, id, src,
            isDisplayed: false,
            types: types.map(({ type }) => type.name),
            moves: moves.map(({ move }) => move.name),
            abilities: abilities.map(({ ability }) => ability.name),
            stats: stats.map(({ base_stat, effort, stat }) => 
              ({ base_stat, effort, name: stat.name }))
          } 
        }

      const pokemons: IPokemon[] = await Promise.all(results.map(getPokemon))

      return {
        pokemons, 
        nextPokemonsUrl: next, 
        previousPokemonsUrl: previous,
      }
      } catch {
        return state
      }
  }, [state])

  const setLoadingPokemons = () => setState({ ...state, loadingPokemons: true })

  const getPreviousPokemons = async () => {
    setLoadingPokemons()

    if (previousPokemonsUrl) {
      const pokemonData = await loadPokemonsData(previousPokemonsUrl)

      setState({ 
        ...pokemonData, 
        loadingPokemons: false,
        pokemonModals: state.pokemonModals.map(
          pokemonModal => ({ ...pokemonModal, display: false })) 
      })
    }
  }

  const getNextPokemons = async () => {
    setLoadingPokemons()

    if (nextPokemonsUrl) {
      const pokemonData = await loadPokemonsData(nextPokemonsUrl)

      setState({ 
        ...pokemonData, 
        loadingPokemons: false,
        pokemonModals: state.pokemonModals.map(
          pokemonModal => ({ ...pokemonModal, display: false })) 
      })
    }
  }

  const openPokemonModal = ({ currentTarget }: MouseEvent<HTMLElement>) => {
    const pokemonName = currentTarget.id
    const pokemonIndex = state.pokemons.findIndex(({ name }) => name === pokemonName)
    const gridRow = `${pokemonIndex + 1} / ${pokemonIndex + 2}`

    pokemonSectionRefs.current[pokemonIndex]!.style.display = "none"

    const newState = { ...state }

    newState.pokemonModals[pokemonIndex] = {
      display: true,
      style: { gridRow }
    }

    setState(newState)
  }

  const closePokemonModal = ({ currentTarget }: MouseEvent<HTMLElement>) => {
    const arrayWithPokemonName = currentTarget.className.match(/close-modal (.*)/)
    const pokemonName = arrayWithPokemonName ? arrayWithPokemonName[1] : ""
    const { pokemons, pokemonModals } = state

    if (arrayWithPokemonName) {
      const pokemonIndex = pokemons.findIndex(({ name }) => name === pokemonName)

      pokemonSectionRefs.current[pokemonIndex]!.style.display = ""
      pokemonModals[pokemonIndex] = { 
        display: false, 
        style: {} 
      }

      setState({ ...state, pokemonModals })
    }
  }

  const value = { 
    state, setState, loadPokemonsData, getNextPokemons, getPreviousPokemons, 
    pokemonSectionRefs, openPokemonModal, closePokemonModal
  }

  return <PokemonContext.Provider value={ value }>
    { children }
  </PokemonContext.Provider>
}

export default PokemonContext