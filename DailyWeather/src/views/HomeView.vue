<template>
  <header v-if="currentConditions" class="header">
      <!-- 지역 -->
      <h1 class="header__title">
        <span class="material-symbols-outlined"> location_on </span>{{  address }}
      </h1>
      <h2 class="header__date">{{ dayjs().format('HH:mm') }}</h2>
    </header>
    <!-- 현재 날씨 -->
    <main v-if="currentConditions" class="main">
      <article class="weather">
        <section class="weather__info">
          <img
            :src="getImage(currentConditions.icon)"
            :alt="`${currentConditions.datetime} ${currentConditions.temp}도`"
            class="weather__img"
          />
        
          <h3 class="weather_temp">{{ currentConditions.temp }}</h3>
          <p class="weather_summary">{{ currentConditions.conditions }}</p>
          <ul class="weather__moreList">
            <li class="weather__moreListItem">
              <p class="weather__subtitle">습도</p>
              <p class="weather__desc">{{ currentConditions.humidity }}</p>
            </li>
            <li class="weather__moreListItem">
              <p class="weather__subtitle">풍속</p>
              <p class="weather__desc">{{ currentConditions.windspeed }}</p>
            </li>
            <li class="weather__moreListItem">
              <p class="weather__subtitle">체감</p>
              <p class="weather__desc">{{ currentConditions.feelslike }}</p>
            </li>
          </ul>
        </section>
      </article>
    </main>
    <!-- 공통 하단 영역 -->


</template>

<script setup>
import { useWeatherStore } from '@/stores/weather.js';
import { storeToRefs } from 'pinia';
import { computed, onBeforeMount } from 'vue';
import dayjs from 'dayjs';
import { getImage } from '@/composables/helper.js';

const weatherStore = useWeatherStore();
const { currentConditions, address } = storeToRefs(weatherStore);
const hourToMinutes =computed(() => {
    const currentDate = new Date();
    const currentHoure = String(currentDate.getHours()).padStart(2,'0');
    const currentMinutes = String(currentDate.getMinutes()).padStart(2,'0');
    return `${currentHoure}:${currentMinutes}`;
});



onBeforeMount(async () => {
  await weatherStore.getCityName();
  await weatherStore.getCurrentWeatherInfo();
});

</script>

<style lang="scss" scoped>

</style>