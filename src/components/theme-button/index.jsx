import { useContext } from 'react'
import './styles.css'
import { ThemeContext } from '../../App'

const ThemeButton = () => {

    const { theme, setTheme } = useContext(ThemeContext);
    console.log(theme, setTheme)

    return (
        <button className="themeButton" style={theme ? { backgroundColor: "#12343b" } : {}} onClick={() => setTheme(!theme)} >Change theme </button>
    )
}

export default ThemeButton