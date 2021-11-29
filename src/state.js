import {ref, computed} from 'vue'
import axios from "axios";

const isAuthenticated = ref(false)
const token = ref('')
const authHeader = ref({})

export default function useState () {
    const initializeState = () => {

        if (localStorage.getItem('token')){
            setToken(localStorage.getItem('token'));
        } else {
            removeToken();
        }
    };

    const setToken = (t) => {
        token.value = t
        isAuthenticated.value = true
        axios.defaults.headers.common["Authorization"] = 'Bearer ' + t;
        authHeader.value = {Authorization: 'Bearer ' + t}
        console.log(axios.defaults.headers)
        localStorage.setItem('token', t)
    }

    const removeToken = () =>{
        token.value = '';
        isAuthenticated.value = false;
        authHeader.value = {Authorization: ''}
        axios.defaults.headers.common["Authorization"] = '';
        localStorage.setItem('token', '');
    };

    const getToken = computed(() =>{
        return token.value;
    });

    const getAuthenticationStatus = computed(() =>{
        return isAuthenticated.value;
    });

    const getAuthHeader = computed(() =>{
        return authHeader.value
    })

    const url = 'http://localhost:8000/'

    return {
        initializeState,
        setToken,
        getToken,
        getAuthenticationStatus,
        removeToken,
        getAuthHeader,
        url
    }

}
