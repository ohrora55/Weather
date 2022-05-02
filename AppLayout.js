import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={{flex: 1, flexDirection: "row"}}>
      <View style={{flex: 3, backgroundColor: "tomato"}}></View>
      <View style={{flex: 3, backgroundColor: "teal"}}></View>
      <View style={{flex: 3, backgroundColor: "orange"}}></View>
    </View>
  );
}
