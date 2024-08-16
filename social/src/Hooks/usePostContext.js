import { PostContext } from "../Context/PostContext";
import { useContext } from "react";

export const usePostContext = () => {

    const context = useContext(PostContext);

    if(!context){
        throw new Error('useTodoContext must be used within a TodoProvider')
    }

    return context;

}