import { PokemonContextProvider } from "./context/PokemonContext"
import { BrowserRouter, Routes, Route  } from "react-router-dom"
import PokemonProfile from "./components/pokemon/PokemonProfile"
import ErrorPage from "./pages/ErrorPage"
import Header from "./components/Header"
import Main from "./components/Main"

export default function App() {
  return <PokemonContextProvider>
    <BrowserRouter>
      <Header />

      <Routes>
        <Route 
          path="/" 
          element={ <Main /> } 
        />

        <Route 
          path="/pokemon/:id" 
          element={ <PokemonProfile /> } 
        />

        <Route path="*" element={ <ErrorPage /> } />
      </Routes>
    </BrowserRouter> 
  </PokemonContextProvider>
}