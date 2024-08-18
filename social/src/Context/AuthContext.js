import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    
    switch(action.type){
        case 'LOGIN':
            return {
                user: action.payload,
            }
        case 'LOGOUT':
            return {
                user: null,
                posts: null,
                profile: null,
            }
        case 'GET_PROFILE':
            return {
                ...state,
                profile: action.payload,
            }
        default:
            return state;
    }
}

export const AuthProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {user: null});
    console.log('AuthContext state: ', state);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('token'));
        if(user){
            dispatch({type: 'LOGIN', payload: user});
        }
    }, [])


    
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}