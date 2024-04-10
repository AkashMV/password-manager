import React, {createContext, useState} from "react";

interface User{
    id: string
    username: string
    cloudId: string | null
    cloudEnabled: boolean
}

interface AuthContextProps{
    user: User | null
    setUser: (user: User | null) => null
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    setUser: () => {},
})

const AuthProvider: React.FC = ({children}) => {
    const [user, setUser] = useState<User | null>(null)

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthProvider, AuthContext}