import { defineStore } from 'pinia'
import axios from 'axios';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';


const axiosInstance = axios.create({
    baseURL: 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline',
    params: {
        lang:'ko',
        key: 'B8C9C2WEUTGCK9CNG8BT6L4B3', 
        unitGroup: 'metric',
    },
});

const axiosInstance2 = axios.create({
    baseURL: 'https://api64.ipify.org?format=json',
});

const axiosInstance3 = axios.create();

export const useWeatherStore = defineStore('weather', ()=>{
    const address = ref('seoul');
    const currentConditions = ref(null);
    const days = ref(null);      // 일자별 날씨 객체가 담긴 배열 
    const searchData = ref([]); // 검색 날씨 데이터

    //오늘 시간대별 데이터 계산
    const hours = computed(() => {
        return days.value?.find((v)=>v.datetime===dayjs().format('YYYY-MM-DD'))?.hours.filter((v)=>v.datetime > dayjs().format('HH:mm:ss'));
    })


    //현재 날씨 정보 가져오기
    const getCurrentWeatherInfo = async () => {
        try {
            const res = await axiosInstance.get('/' + address.value);
            currentConditions.value = res.data.currentConditions;
            days.value = res.data.days;
        } catch (e) {
            alert(e.response?.data ? e.response.data : e.message);
        }
    }
    const forecast = computed(()=>{
        return days.value?.filter((v)=>v.datetime > dayjs().format('YYYY-MM-DD'));
    })

    const getSearchWeatherInfo = async (city)=>{
        try {
            const res = await axiosInstance.get('/' + city);

            const printData={
                address: res.data.address, //지역명
                feelslikemax: res.data.days[0].feelslikemax, //체감 최고온도
                feelslikemin: res.data.days[0].feelslikemin, //체감 최저온도
                icon: res.data.currentConditions.icon, //날씨 아이콘
                temp: res.data.currentConditions.temp, //현재 온도
            };


            //이미 추가한 지역이면 중복으로 추가하지 않음
            if(
                searchData.value.findIndex((v)=> v.address === res.data.address) === -1
            ){
                searchData.value.push(printData);
            }else{
                alert('이미 조회한 지역입니다.')
            }
            
        } catch (e) {
            alert(e.response?.data ? e.response.data : e.message);
        }
    };

    const getCityName = async ()=>{
        try {
            const res =  await axiosInstance2.get('');
            const ip = res.data.ip;

            const res2 = await axiosInstance3.get('/ipapi/api/json/' + ip);
            address.value = res2.data.cityName;
        } catch (e) {
            alert(e.response?.data ? e.response.data : e.message);
        }
    };



    return { currentConditions, getCurrentWeatherInfo, hours, forecast, getSearchWeatherInfo, searchData, getCityName, address  };
});