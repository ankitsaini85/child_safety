import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const StudentsList = ({ route }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://192.168.159.134:3000/students/${route}`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [route]);

  const handleAttendance = (studentId, status) => {
    // Handle attendance logic here
    console.log(`Student ID: ${studentId}, Status: ${status}`);
  };

  return (
    <ScrollView style={styles.container}>
      {students.map(student => (
        <View key={student._id} style={styles.studentCard}>
          <Image source={{ uri: student.photo }} style={styles.photo} />
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.class}>{student.class}</Text>
          <View style={styles.buttons}>
            <Button title="Present" onPress={() => handleAttendance(student._id, 'present')} />
            <Button title="Absent" onPress={() => handleAttendance(student._id, 'absent')} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  studentCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  class: {
    fontSize: 16,
    color: '#666',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default StudentsList;