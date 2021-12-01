import {ref, computed} from 'vue'
import axios from "axios";

const isAuthenticated = ref(false)
const token = ref('')
const authHeader = ref({})
const isSignUp = ref(false)
const tempExpanded = ref(false)
const loading =  ref(false)
const babies = ref({
        'babies': []
    })

export default function useState () {

    const setAuthentication = (t) =>{
        isAuthenticated.value = t
    }

    const initializeState = () => {

        if (localStorage.getItem('token')){
            setToken(localStorage.getItem('token'));
        } else {
            removeToken();
        }
    };

    const setToken = (t) => {
        token.value = t
        setAuthentication(true);
        // axios.defaults.headers.common["Authorization"] = 'Bearer ' + t;
        authHeader.value = {Authorization: 'Bearer ' + t};
        localStorage.setItem('token', t);
    }

    const removeToken = () =>{
        token.value = '';
        setAuthentication(false);
        authHeader.value = {Authorization: ''}
        // axios.defaults.headers.common["Authorization"] = '';
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

    const getSignUp = computed(()=>{
        return isSignUp.value
    })

    const switchSignUp = () => {
        isSignUp.value = !isSignUp.value
    }

    const getTempState = computed(()=>{
        return tempExpanded.value
    })

    const closeTemp = () => {
        tempExpanded.value = false
    }

    const openTemp = () => {
        tempExpanded.value = true
    }

    const switchTemp = () => {
        tempExpanded.value = !tempExpanded.value
    }

    const getBaby = computed(()=>{
      return babies.value.babies
    })

    const addBaby = (newBaby) =>{
        babies.value.babies.push(newBaby)
    }

    function setBaby(t){
      babies.value.babies = t
    }

    function switchLoading(){
        loading.value = !loading.value
    }

    function notLoading(){
        loading.value = false
    }

    function isLoading(){
        loading.value = true
    }

    async function loadBaby(){
        const fullUrl = url + "babies/"
        await fetch(fullUrl, {
            headers: getAuthHeader.value
          }).then(response => {
            if (response.status === 200){
              return response.json()
            } else {
              return null
            }
          }).then(data => {
            if (data) {
              setBaby(data)
            } else {
              setBaby([])
            }
          })
    }

    const url = import.meta.env.VITE_HOSTNAME

    return {
        initializeState,
        setToken,
        getToken,
        getAuthenticationStatus,
        removeToken,
        getAuthHeader,
        url,
        getSignUp,
        switchSignUp,
        getTempState,
        closeTemp,
        openTemp,
        switchTemp,
        getBaby,
        setBaby,
        loadBaby,
        loading,
        isLoading,
        notLoading,
        addBaby,
        setAuthentication
    }

}
