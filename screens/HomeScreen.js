import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
// style
import { LinearGradient } from 'expo-linear-gradient';
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/mini';
import { MapPinIcon } from 'react-native-heroicons/solid';
// local
import colorPalette from '../style/colors';
import { weatherIcons } from '../constants/index';
import { fetchLocation, fetchWeather } from '../api/openWeather';
import moment from 'moment';

const Kharkiv = {
  name: 'Kharkiv',
  local_names: {
    en: 'Kharkiv',
    uk: 'Харків',
  },
  lat: 49.9923181,
  lon: 36.2310146,
  country: 'UA',
  state: 'Kharkiv Oblast',
};

const HomeScreen = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchRes, setSearchRes] = useState([]);
  // current location
  const [location, setLocation] = useState(Kharkiv);
  const [units, setUnits] = useState('metric'); // 'metric' / 'imperial'
  //weather in current location
  const [weather, setWeather] = useState();

  // pick image by weather code
  const pickImage = (icon) => {
    let res;

    switch (icon) {
      case '01d':
      case '01n':
      case '02d':
      case '02n':
      case '10d':
      case '10n':
      case '13d':
      case '13n':
        res = icon;
        break;
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        res = '03';
        break;
      case '09d':
      case '09n':
        res = '09';
        break;
      case '11d':
      case '11n':
        res = '11';
        break;
      case '50d':
      case '50n':
      default:
        res = '50';
        break;
    }

    return weatherIcons[res];
  };

  // format location data
  function round(num) {
    return Number.parseFloat(num).toFixed(2);
  }
  //change units
  const handleUnitsChange = () => {
    console.log('change');
    const res = units === 'metric' ? 'imperial' : 'metric';
    setUnits(res);
  };

  // search for location data by query
  const handleSearch = (query) => {
    if (query.length < 3) return null;

    const params = {
      q: query,
      limit: '3',
    };

    fetchLocation(params).then((data) => {
      setSearchRes(data);
    });
  };
  // debounce search function, to provide less trafic
  const handleSearchDebounce = useCallback(debounce(handleSearch, 1200), []);
  // forecast weather data of current location one day
  useEffect(() => {
    const params = {
      lat: `${round(location.lat)}`,
      lon: `${round(location.lon)}`,
      units: units,
    };
    fetchWeather(params).then((data) => {
      console.log('Weather data for', location.name, 'loaded');
      setWeather(data);
      setSearchRes([]);
      setIsSearching(false);
    });
  }, [location, units]);

  return (
    // Background Linear Gradient
    <LinearGradient
      colors={[colorPalette.red, colorPalette.monoLight, colorPalette.monoDark]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ height: '100%' }}
      className='flex-1 relative'
    >
      <StatusBar style='light' />

      <SafeAreaView
        className='flex flex-1'
        style={{ marginTop: Constants.statusBarHeight + 20 }}
      >
        {/* search */}
        <View style={{ height: '7%' }} className='mx-4 relative z-50'>
          <View
            className='flex-row justify-end items-center rounded-full'
            style={{
              backgroundColor: isSearching
                ? colorPalette.glass(0.2)
                : colorPalette.glass(0),
            }}
          >
            {/* search input */}
            {isSearching ? (
              <TextInput
                onChangeText={handleSearchDebounce}
                placeholder='Search'
                placeholderTextColor={'lightgray'}
                className='pl-6 h-10 pb-1 flex-1 text-base text-white'
              />
            ) : null}

            <TouchableOpacity
              onPress={() => setIsSearching(!isSearching)}
              style={{
                backgroundColor: !isSearching
                  ? colorPalette.glass(0.2)
                  : colorPalette.glass(0),
              }}
              className='rounded-full p-3 m-1'
            >
              <MagnifyingGlassIcon color='white' size='25' />
            </TouchableOpacity>
          </View>

          {/* choose from search results */}
          {searchRes?.length > 0 && isSearching ? (
            <View className='absolute w-full bg-gray-300 top-16 rounded-3xl'>
              {searchRes.map((res, index) => {
                const isLastChild =
                  index + 1 < searchRes.length
                    ? 'border-b-2 border-b-gray-400'
                    : '';
                return (
                  <TouchableOpacity
                    onPress={() => setLocation(res)}
                    key={`searchResult#${index}`}
                    className={`flex-row item-center border-0 py-3 px-4 mb-1 ${isLastChild}`}
                  >
                    <MapPinIcon color='gray' size='20' />
                    <Text className='text-black text-lg ml-2'>
                      {`${res.name}${res.state?.length > 2 ? ', ' : ''}${
                        res.state?.length > 2 ? res.state : ''
                      }`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>

        {/* forecast information */}
        <View className='mx-4 flex justify-around flex-1 mb-2'>
          {/* Title */}
          <Text className=' text-white text-center text-2xl font-bold'>
            {location.name}
            {location?.state && location?.state?.length > 2 ? (
              <Text className='text-lg font-semibold text-gray-300'>
                {', '}
                {location.state}
              </Text>
            ) : null}
          </Text>

          {/* Image */}
          <View className='flex-row justify-center'>
            <Image
              source={pickImage(weather?.current?.weather[0].icon)}
              className='w-52 h-52'
            />
          </View>

          {/* temperature */}
          <View className='space-y-2'>
            <TouchableOpacity onPress={() => {}}>
              <Text className='text-center font-bold text-white text-6xl ml-5'>
                {weather?.current.temp.toFixed()}
                {units === 'metric' ? '\u2103' : '\u2109'}
              </Text>
            </TouchableOpacity>

            <Text className='text-center text-white text-xl tracking-widest'>
              {weather?.current.weather[0].main}
            </Text>
          </View>

          {/* more info */}
          <View className='flex-row justify-between mx-4'>
            {/* humidity */}
            <View className='flex-row space-x-2 items-center'>
              <Image
                source={require('../assets/humidity.png')}
                className='h-6 w-6'
              />

              <Text className='text-white font-semibold text-base'>
                {weather?.current?.humidity}
              </Text>
            </View>
            {/* wind speed */}
            <View className='flex-row space-x-2 items-center'>
              <Image
                source={require('../assets/windSpeed.png')}
                className='h-6 w-6'
              />

              <Text className='text-white font-semibold text-base'>
                {weather?.current?.wind_speed}
              </Text>
            </View>
            {/* clouds */}
            <View className='flex-row space-x-2 items-center'>
              <Image
                source={require('../assets/clouds.png')}
                className='h-6 w-6'
              />

              <Text className='text-white font-semibold text-base'>
                {weather?.current?.clouds}%
              </Text>
            </View>
          </View>

          {/* for next days */}
          <View className='mb-2 space-y-3'>
            <View className='flex-row items-center mx-5 space-x-2'>
              <CalendarDaysIcon size='22' color='white' />

              <Text className='text-white text-base'> Daily forecast</Text>
            </View>

            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
            >
              {weather?.daily?.map((day, index) => (
                <View
                  key={day.dt}
                  className='flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4'
                  style={{ backgroundColor: colorPalette.glass(0.15) }}
                >
                  <Image
                    source={pickImage(day.weather[0].icon)}
                    className='h-11 w-11'
                  />

                  <Text className='text-white'>
                    {moment().add(index, 'days').format('dddd')}
                  </Text>

                  <Text className='text-white text-xl font-semibold'>
                    {day.temp.day.toFixed()}
                    {units === 'metric' ? '\u2103' : '\u2109'}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;
