import { 
  CSSProperties, 
  createContext, 
  ReactNode, 
  useState,
  Dispatch,
  SetStateAction,
  useCallback
} from "react"
import { 
  IPokemon, 
  IPokeApiPokemon, 
  IPokeApiResponse, 
  IPokemonState 
} from "../interfaces/pokemon"
import useLocalStorage from "../hooks/useLocalStorage"
import { MouseEventHandler } from "react"

export interface IPokemonModal {
  readonly display: boolean
  readonly style: CSSProperties
}

export interface IPokemonContext {
  readonly state: IPokemonState
  readonly pokemonsLocalStorage: IPokemon[]

  readonly setPokemonsToLocalStorage: (value: IPokemon[] | ((oldValue: IPokemon[]) => void)) => void
  readonly setState: Dispatch<SetStateAction<IPokemonState>>
  readonly loadPokemonsData: (url?: string) => Promise<IPokemonState>
  readonly getPreviousPokemons: MouseEventHandler<HTMLElement>
  readonly getNextPokemons: MouseEventHandler<HTMLElement>
}

export const initialState: IPokemonState = {
  pokemons: [],
  previousPokemonsUrl: "",
  nextPokemonsUrl: "",
}

const initialContextState: IPokemonContext = { 
  state: initialState, 
  pokemonsLocalStorage: [] as IPokemon[],
  setPokemonsToLocalStorage: (value: IPokemon[] | ((oldValue: IPokemon[]) => void)) => {},
  setState: () => {},
  loadPokemonsData: async (url?: string) => ({}) as IPokemonState,
  getPreviousPokemons: () => {},
  getNextPokemons: () => {},
}

const PokemonContext = createContext<typeof initialContextState>(initialContextState)

interface IPokemonContextProviderProps {
  readonly children: ReactNode
}

async function getJSON(url: string) {
  const response = await fetch(url)
  return response.json()
}

async function getPokemonProfileImage(url: string): Promise<string> {
  try {
    const { sprites } = await getJSON(url)
    const other = sprites.other
    const profileImageURL = other["official-artwork"]["front_default"]
    const profileImageResponse = await fetch(profileImageURL)
    const profileImageBlob = await profileImageResponse.blob()
    const profileImage = URL.createObjectURL(profileImageBlob as Blob)
    
    return profileImage
  } catch {
    return ""
  }
}

async function getPokemonImage(
  id: number,
  url: string = "https://pokeapi.co/api/v2/pokemon-form"
) {
  try {
    const { sprites } = await getJSON(`${url}/${id}`)
    const imageURL = sprites["front_default"]
    const response = await fetch(imageURL)
    const blob = await response.blob()
    const image = URL.createObjectURL(blob as Blob)

    return image
  } catch {
    return ""
  }
}

export function PokemonContextProvider(
  { children }: IPokemonContextProviderProps
) {
  const [state, setState] = useState<IPokemonState>(initialState as IPokemonState)
  const [pokemonsLocalStorage, setPokemonsToLocalStorage] = useLocalStorage<IPokemon[]>("pokemons", [])
  const { previousPokemonsUrl, nextPokemonsUrl } = state

  const loadPokemonsData = useCallback<(url?: string) => Promise<IPokemonState>>(
    async (url = "https://pokeapi.co/api/v2/pokemon") => {
      try {
        const { results, next, previous }: IPokeApiResponse = await getJSON(url)
        const getPokemon = async ({ name, url }: IPokeApiPokemon) => {
          const {
            id, moves, types, abilities, height, weight, stats
          }: IPokeApiPokemon = await getJSON(url)
          const smallImage = await getPokemonImage(id)
          const largeImage = await getPokemonProfileImage(url)

          return {
            height, weight, id, url, 
            isDisplayed: false,
            name: name.at(0)?.toUpperCase() + name.slice(1), 
            image: { small: smallImage, large: largeImage },
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
        return { pokemons: [], nextPokemonsUrl: "", previousPokemonsUrl: "" } 
      }
  }, [])


  const resetPokemonLocalStorage = () => {
    setPokemonsToLocalStorage([])
  }

  const getPreviousPokemons = async () => {
    if (previousPokemonsUrl) {
      resetPokemonLocalStorage()
      const pokemonData = await loadPokemonsData(previousPokemonsUrl)

      setState(pokemonData)
      setPokemonsToLocalStorage(pokemonData.pokemons)
    }
  }

  const getNextPokemons = async () => {
    if (nextPokemonsUrl) {
      resetPokemonLocalStorage()
      const pokemonData = await loadPokemonsData(nextPokemonsUrl)

      setState(pokemonData)
      setPokemonsToLocalStorage(pokemonData.pokemons)
    }
  }

  const value: IPokemonContext = { 
    state, 
    setState, 
    loadPokemonsData, 
    getNextPokemons, 
    getPreviousPokemons, 
    pokemonsLocalStorage, 
    setPokemonsToLocalStorage
  }

  return <PokemonContext.Provider value={ value }>
    { children }
  </PokemonContext.Provider>
}

export default PokemonContext