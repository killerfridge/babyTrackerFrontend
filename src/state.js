import {ref, computed} from 'vue'

const isAuthenticated = ref(false)
const token = ref('')
const authHeader = ref({})
const isSignUp = ref(false)
const tempExpanded = ref(false)
const loading =  ref(false)
const plotsLoaded = ref(false)
const babies = ref({
        'babies': []
    })
const plotData = ref({
    feeds: {},
    sleeps: {},
    weights: {},
    temps: {},
})

export default function useState () {

    const setPlotData = (key, id, value) =>{
        plotData.value[key][id] = value
    }

    const getPlotData = computed(()=>{
        return plotData.value
    })

    const getPlotsLoaded = computed(()=>{
        return plotsLoaded.value
    })

    const loadPlotData = async (id) => {
        plotsLoaded.value = false
        const feedUrl = url + "feeds/" + id + "/plot"
        const sleepUrl = url + "sleep/" + id + "/plot"
        const weightUrl = url + "weights/" + id + "/plot"
        const tempUrl = url + "temperatures/" + id + "/plot"

        await fetch(feedUrl, {
            headers: getAuthHeader.value
        }).then(response=>response.json())
            .then(data => setPlotData('feeds', id, data))
            .catch(error=>console.log)

        await fetch(sleepUrl, {
            headers: getAuthHeader.value
        }).then(response=>response.json())
            .then(data=>setPlotData('sleeps', id, data))
            .catch(error=>console.log)

        await fetch(weightUrl, {
            headers: getAuthHeader.value
        }).then(response=>response.json())
            .then(data=>setPlotData('weights', id, data))
            .catch(error=>console.log)

        await fetch(tempUrl, {
            headers: getAuthHeader.value
        }).then(response=>response.json())
            .then(data=>setPlotData('temps', id, data))
            .catch(error=>console.log)

        plotsLoaded.value = true
    }

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
        setAuthentication,
        getPlotData,
        setPlotData,
        loadPlotData,
        getPlotsLoaded
    }

}
