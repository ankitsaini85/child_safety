// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Image, StyleSheet, ScrollView } from 'react-native';
// import axios from 'axios';

// const StudentsList = ({ busNumber }) => {
//   const [students, setStudents] = useState([]);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         console.log(`Fetching students for bus number: ${busNumber}`);
//         const response = await axios.get(`http://192.168.144.134:3000/students/${busNumber}`);
//         console.log('Fetched students:', response.data);
//         setStudents(response.data);
//       } catch (error) {
//         console.error('Error fetching students:', error);
//       }
//     };

//     fetchStudents();
//   }, [busNumber]);

//   const handleAttendance = (studentId, status) => {
//     setStudents(prevStudents =>
//       prevStudents.map(student =>
//         student._id === studentId ? { ...student, attendance: status } : student
//       )
//     );
//     console.log(`Student ID: ${studentId}, Status: ${status}`);
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {students.map(student => (
//         <View key={student._id} style={styles.studentCard}>
//           <Image source={{ uri: student.photo }} style={styles.photo} />
//           <Text style={styles.name}>{student.name}</Text>
//           <Text style={styles.class}>{student.class}</Text>
//           <View style={styles.buttons}>
//             <Button
//               title="Present"
//               onPress={() => handleAttendance(student._id, 'present')}
//               color={student.attendance === 'present' ? 'green' : 'blue'}
//               // disabled={student.attendance !== undefined}
//             />
//             <Button
//               title="Absent"
//               onPress={() => handleAttendance(student._id, 'absent')}
//               color={student.attendance === 'absent' ? 'red' : 'blue'}
//               // disabled={student.attendance !== undefined}
//             />
//           </View>
//         </View>
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   studentCard: {
//     marginBottom: 16,
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   photo: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     marginBottom: 8,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   class: {
//     fontSize: 16,
//     color: '#666',
//   },
//   buttons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 8,
//   },
// });

// export default StudentsList;

import React, { useEffect, useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';

const StudentsList = ({ busNumber }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        console.log(`Fetching students for bus number: ${busNumber}`);
        const response = await axios.get(`http://192.168.144.134:3000/students/${busNumber}`);
        console.log('Fetched students:', response.data);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [busNumber]);

  const handleAttendance = async (studentId, status, email) => {
    setStudents(prevStudents =>
      prevStudents.map(student =>
        student._id === studentId ? { ...student, attendance: status } : student
      )
    );
    console.log(`Student ID: ${studentId}, Status: ${status}`);

    try {
      await axios.post('http://192.168.144.134:3000/send-email', {
        email: email,
        subject: 'Attendance(Bus) Notification',
        text: `Your child has been marked as ${status}.`
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {students.map(student => (
        <View key={student._id} style={styles.studentCard}>
          <Image source={{ uri: student.photo }} style={styles.photo} />
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.class}>{student.class}</Text>
          <View style={styles.buttons}>
            <Button
              title="Present"
              onPress={() => handleAttendance(student._id, 'present', student.email)}
              color={student.attendance === 'present' ? 'green' : 'blue'}
              // disabled={student.attendance === 'present' || student.attendance === 'absent'}
            />
            <Button
              title="Absent"
              onPress={() => handleAttendance(student._id, 'absent', student.email)}
              color={student.attendance === 'absent' ? 'red' : 'blue'}
              // disabled={student.attendance === 'present' || student.attendance === 'absent'}
            />
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