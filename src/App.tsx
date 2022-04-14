import { BrowserRouter, Routes, Route  } from "react-router-dom"
import { PokemonContextProvider } from "./context/pokemon"
import { MutableRefObject, useRef } from "react"
import PokemonProfile from "./components/Pokemon/Profile"
import ErrorPage from "./pages/ErrorPage"
import Header from "./components/Header"
import Main from "./components/Main"
import SearchPokemon from "./components/Pokemon/Search"

export default function App() {
  const pokemonSearchRef = useRef<HTMLInputElement>() as MutableRefObject<HTMLInputElement>

  return <PokemonContextProvider>
    <BrowserRouter>
      <Header />
      <SearchPokemon 
        ref={ pokemonSearchRef } 
      />

      <Routes>
        <Route path="/" element={ <Main ref={ pokemonSearchRef} /> } />
        <Route path="/pokemon/:id" element={ <PokemonProfile /> } />
        <Route path="*" element={ <ErrorPage /> } />
      </Routes>
    </BrowserRouter> 
  </PokemonContextProvider>
}