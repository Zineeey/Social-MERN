import { useAuthContext } from './useAuthContext';

export const useLogout = () =>{
    const {dispatch} = useAuthContext();
    // Dispatch the posts
    // const {dispatch: postDispatch} = useTodoContext();

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({type: 'LOGOUT'});
        // postDispatch({type: 'GET_POSTS', payload: null});

    }
    return {logout};
} 