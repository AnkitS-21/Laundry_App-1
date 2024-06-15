import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet } from "react-native";
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { app } from "../firebase";

const UpdateStatus = () => {
  const [laundryData, setLaundryData] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  useEffect(() => {
    const fetchLaundryData = async () => {
      try {
        const firestore = getFirestore(app);
        const laundryDetailsRef = collection(firestore, 'laundryDetails');
        const querySnapshot = await getDocs(laundryDetailsRef);
        const data = [];
        querySnapshot.forEach(doc => {
          data.push({ ...doc.data(), id: doc.id });
        });
        setLaundryData(data);
      } catch (error) {
        console.error('Error fetching laundry data:', error);
      }
    };

    fetchLaundryData();
  }, []);

  const handleSearch = () => {
    let filteredData = [...laundryData];

    if (searchDate) {
      const formattedSearchDate = searchDate.split('/').reverse().join('-');
      filteredData = filteredData.filter(item => {
        if (!item.date) {
          return false;
        }
        const itemDate = item.date.split('/').reverse().join('-');
        return itemDate === formattedSearchDate;
      });
    }

    if (searchCode) {
      filteredData = filteredData.filter(item => item.laundryCode.includes(searchCode));
    }

    if (searchStatus) {
      filteredData = filteredData.filter(item => item.status.toLowerCase().includes(searchStatus.toLowerCase()));
    }

    setLaundryData(filteredData);
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    try {
      const firestore = getFirestore(app);
      const laundryDocRef = doc(firestore, 'laundryDetails', id);

      let newStatus = '';

      if (currentStatus === 'Laundry Picked') {
        newStatus = 'Ready for Pickup';
      } else if (currentStatus === 'Ready for Pickup') {
        newStatus = 'Delivered';
      } else if (currentStatus === 'Delivered') {
        return; // Do nothing if already delivered
      }

      await updateDoc(laundryDocRef, {
        status: newStatus
      });

      alert(`Status updated to ${newStatus} successfully`);
      
      // Update local state
      setLaundryData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Date (YYYY-MM-DD)"
          value={searchDate}
          onChangeText={setSearchDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Laundry Code"
          value={searchCode}
          onChangeText={setSearchCode}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Status"
          value={searchStatus}
          onChangeText={setSearchStatus}
        />
        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>
      <View style={styles.dataBox}>
        <View style={styles.dataHeading}>
          <Text style={styles.dataTextHeading}>Date</Text>
          <Text style={styles.dataTextHeading}>Name</Text>
          <Text style={styles.dataTextHeading}>Laundry Code</Text>
          <Text style={styles.dataTextHeading}>No of Clothes</Text>
        </View>
        {laundryData.map((item, index) => (
          <View style={styles.data} key={index}>
            <View style={styles.dataRow}>
              <Text style={styles.datatext}>{item.date}</Text>
              <Text style={styles.datatext}>{item.name}</Text>
              <Text style={styles.datatext}>{item.laundryCode}</Text>
              <Text style={styles.datatext}>{item.clothes}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.datatext}>
                <Text style={styles.boldText}>Status:</Text> {item.status}
              </Text>
              <Pressable
                style={[
                  styles.updateButton,
                  item.status === 'Delivered'
                    ? styles.greyButton
                    : item.status === 'Ready for Pickup'
                    ? styles.greenButton
                    : styles.orangeButton
                ]}
                onPress={() => handleUpdateStatus(item.id, item.status)}
                disabled={item.status === 'Delivered'}
              >
                <Text style={styles.updateButtonText}>
                  {item.status === 'Laundry Picked' ? 'Ready to Take' : item.status === 'Ready for Pickup' ? 'Laundry Taken' : 'Already Delivered'}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
    margin: 10,
  },
  searchContainer: {
    margin: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    marginBottom:7,
  },
  searchButton: {
    backgroundColor: "lightblue",
    width: 200,
    marginTop: 3,
    borderWidth : 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  searchButtonText: {
    color: "black",
    fontSize: 17,
    fontWeight: "bold",
    textAlign:"center"

  },
  dataBox: {
    borderWidth: 2,
    borderRadius: 10,
    padding: 2,
  },
  dataHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 3,
    backgroundColor: "lightblue",
    borderWidth:1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  dataTextHeading: {
    flex: 1,
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  data: {
    paddingTop:5,
    marginBottom: 0,
    borderBottomWidth: 1.5,
    borderColor: "#ccc",
    paddingBottom: 0,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  datatext: {
    flex: 1,
    fontSize: 14,
    color: "black",
    textAlign: "center",
  },
  boldText: {
    fontWeight: "bold",
  },
  updateButton: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  orangeButton: {
    backgroundColor: "orange",
  },
  greenButton: {
    backgroundColor: "lightgreen",
  },
  greyButton: {
    backgroundColor: "#ccc",
  },
  updateButtonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default UpdateStatus;
