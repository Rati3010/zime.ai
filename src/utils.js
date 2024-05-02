import axios from 'axios';
export const fetchData = async() =>{
    try {
        const dummy = await axios.get(`https://dummyjson.com/posts`);
        return dummy.data;
    } catch (error) {
        console.log(error);
    }
}
