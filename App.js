import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons'; 

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "5c2cafd3983a471f3ee179ca84cbba54";

const icons = {
  "Thunderstorm": "lightning",
  "Drizzle": "rains",
  "Rain": "rain",
  "Snow" : "snowflake",
  "Atmosphere": "cloudy-gusts",
  "Clear" : "day-sunny",
  "Clouds": "cloudy",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [location, setLocation] = useState();
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    }
    const { coords:{latitude, longitude} } = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude }, 
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        pagingEnabled 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator 
              color="white" 
              style={{ marginTop: 10 }} 
              size="large" 
            />
          </View>
        ) : (
          days.map( (day, index) => 
            <View key={index} style={styles.day}>
              <View style={{ 
                flexDirection: "row", 
                alignItems: "center", 
                justifyContent: "space-between",
                width: "100%"
                }}
              >
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color="white" style={{marginRight: "4%"}}/>
              </View> 
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          )
        )}

      </ScrollView>
    </View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.8,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 88,
    fontWeight: "300",
    color: "white",
  },
  weather: {
    
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "stretch",
  },
  temp: {
    marginTop: 50,
    marginLeft: 20,
    fontWeight: "500",
    fontSize: 120,
    color: "white",
  },
  description: {
    marginTop: -20,
    marginLeft: 30,
    fontSize: 50,
    color: "white",
  },
  tinyText: {
    marginTop: -10,
    fontWeight: "300",
    fontSize: 30,
    marginLeft: 30,
    color: "white",
  }
})