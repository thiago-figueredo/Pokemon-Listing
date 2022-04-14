interface IPokemonImage {
  readonly small: string
  readonly large: string
}

interface IPokemonInfo {
  readonly id: number
  readonly name: string
  readonly height: number
  readonly weight: number
  readonly abilities: string[]
  readonly types: string[]
  readonly stats: IPokemonStat[]
}

export interface IPokemonState {
  readonly pokemons: IPokemon[]
  readonly previousPokemonsUrl: string
  readonly nextPokemonsUrl: string
}

export interface IPokemonStat {
  readonly name: string
  readonly base_stat: number
  readonly effort: number
}

export type IPokemonTypes = string[]
export type IPokemonMoves = string[]
export type IPokemonAbilities = string[]
export type IPokemonStats = IPokemonStat[]

interface IPokeApiPokemonStat {
  readonly stat: { name: string }
  readonly base_stat: number
  readonly effort: number
}

export interface IPokemonAbility {
  readonly ability: { name: string }
}

export interface IPokeApiPokemon {
  readonly name: string
  readonly url: string
}

export interface IPokeApiPokemonType {
  readonly type: { name: string }
}

interface IPokeApiPokemonMove {
  readonly move: { 
    readonly name: string
    readonly effect: string
  }
}

export interface IPokeApiPokemon {
  readonly id: number
  readonly name: string
  readonly height: number
  readonly weight: number
  readonly abilities: IPokemonAbility[]
  readonly types: IPokeApiPokemonType[]
  readonly moves: IPokeApiPokemonMove[]
  readonly stats: IPokeApiPokemonStat[]
}

export interface IPokeApiResponse {
  readonly results: IPokeApiPokemon[]
  readonly previous: string
  readonly next: string
}

export interface IPokemon extends IPokemonInfo {
  readonly image: IPokemonImage
  readonly url: string
  readonly isDisplayed: boolean
}