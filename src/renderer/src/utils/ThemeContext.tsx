import React, {createContext, useState, useContext} from "react"

type Theme = "dark" | "light"

interface ThemeContextProps{
    theme: Theme
    toggleTheme: () => void
}


const ThemeContext = createContext<ThemeContextProps>({
    theme:"dark",
    toggleTheme: () => {}
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC = ({children}) => {
    const [theme, setTheme] = useState<Theme>("dark")

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'))
    }

    return(
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}
