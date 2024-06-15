import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from "../firebase";

const LaundryDetails = () => {
  const [laundryCode, setLaundryCode] = useState('');
  const [laundryData, setLaundryData] = useState([]);

  const fetchLaundryDetails = async () => {
    const firestore = getFirestore(app);
    const q = query(collection(firestore, 'laundryDetails'), where('laundryCode', '==', laundryCode));
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach(doc => {
      data.push(doc.data());
    });
    setLaundryData(data);
  };

  const renderItem = ({ item }) => {
    let statusColor = 'black'; // default color
    let statusFontSize = 16; // default font size
    let statusText = item.status; // default status text

    switch (item.status) {
      case 'Ready for Pickup':
        statusColor = 'orange';
        break;
      case 'Delivered':
        statusColor = 'green';
        break;
      default:
        statusColor = 'black';
        break;
    }

    return (
      <View style={styles.itemContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Laundry Code:</Text>
          <Text>{item.laundryCode}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text>{item.date}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Clothes:</Text>
          <Text>{item.clothes}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Hostel:</Text>
          <Text>{item.hostel}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text>{item.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Roll Number:</Text>
          <Text>{item.rollnumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text>{item.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { fontWeight: 'bold', textAlign: 'center' }]}>Status:</Text>
          <Text style={{ color: statusColor, fontSize: statusFontSize, textAlign: 'center' }}>{statusText}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Laundry Code"
        value={laundryCode}
        onChangeText={text => setLaundryCode(text)}
      />
      <Button title="Fetch Details" onPress={fetchLaundryDetails} />
      <FlatList
        data={laundryData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    marginRight: 10,
  },
});

export default LaundryDetails;
