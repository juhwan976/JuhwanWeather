import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, Vibration, View } from 'react-native';
import { Fontisto } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get('window').width;
const API_KEY = 'e7fa44288f99696f69a0c3a9babc56a3';
const CNT = 5;

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
}

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }

    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);

    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&cnt=${CNT}`);
    const json = await response.json();
    setDays(json.list);
  }

  useEffect(() => {
    getWeather();
  });

  return (
    <View style={styles.container}>
      <StatusBar style='light' />

      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>

      <ScrollView
        pagingEnabled
        horizontal
        showsVerticalScrollIndicator='false'
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: 'center' }}>
            <ActivityIndicator
              color='white'
              style={{ marginTop: 10 }}
              size='large'
            />
          </View>) : (
          days.map((day, index) => {
            return <View key={index} style={styles.day}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between'
              }}>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color='white' />
              </View>
              <Text style={styles.description}>
                {day.weather[0].main}
              </Text>
              <Text style={styles.tinyDescription}>
                {day.weather[0].description}
              </Text>
              <Text style={styles.date}>
                {day.dt_txt.substring(0, 4)}년 {' '}
                {day.dt_txt.substring(5, 7)}월 {' '}
                {day.dt_txt.substring(8, 10)}일 {' '}
                {day.dt_txt.substring(11, 13)}시
              </Text>
            </View>;
          })
        )}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'teal',
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 68,
    fontWeight: '500',
    color: 'white',
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    color: 'white',
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: 'white',
    fontWeight: '500',
  },
  tinyDescription: {
    marginTop: -5,
    fontSize: 25,
    color: 'white',
    fontWeight: '500'
  },
  date: {
    marginTop: -5,
    color: 'white',
    fontSize: 25,
    fontWeight: '500',
  }
});