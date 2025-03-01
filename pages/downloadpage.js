import { useState, useEffect, useRef } from 'react';
import { Box, Button, Flex, Text, VStack, Heading, Table } from '@chakra-ui/react';
import BottomNavigationBar from '../components/BottomNavigationBar';

import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firestore config

import * as XLSX from 'xlsx';

import DownloadIcon from '@mui/icons-material/Download'

const downloadpage = () => {
  const [entries, setEntries] = useState([]); // State to store the fetched data
  const [selectedDate, setSelectedDate] = useState([]);
  const [currentSelectedDate, setCurrentSelectedDate] = useState(''); // State for the selected date for download

  useEffect(() => {
    //fetchData(selectedDate); // Fetch data for today's date
    fetchCreatedAtDates();
  }, []);

  const fetchCreatedAtDates = async () => {
    const querySnapshot = await getDocs(collection(db, 'patients'));

    const dateCountMap = new Map();

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.createdAt) {
        // Extract the date part only (ignoring time)
        const date = data.createdAt.toDate();
        const formattedDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        }); // Format date as "22 Feb"

        // Update the count for this date
        if (dateCountMap.has(formattedDate)) {
          dateCountMap.set(formattedDate, dateCountMap.get(formattedDate) + 1);
        } else {
          dateCountMap.set(formattedDate, 1);
        }
      }
    });

    // Convert the map into an array of date-count pairs
    const dateCountsArray = Array.from(dateCountMap, ([date, count]) => ({ date, count }));

    // Sort the array by date (latest date first)
  dateCountsArray.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // Sort in descending order
  });
  
    setSelectedDate(dateCountsArray);
    console.log(dateCountsArray);
  }
  // Function to fetch data from Firestore based on the current date
  const fetchData = async (selectedDate) => {
    setCurrentSelectedDate(selectedDate);
   // Convert the selected date (e.g., "22 Feb") to a Date object
   const [day, month] = selectedDate.split(' ');
   const year = new Date().getFullYear(); // Current year, you can adjust this if needed

   // Create a new Date object for the start of the day (00:00:00) and end of the day (23:59:59)
   const startOfDay = new Date(`${month} ${day}, ${year} 00:00:00`);
   const endOfDay = new Date(`${month} ${day}, ${year} 23:59:59`);

   console.log('Start of day:', startOfDay);
   console.log('End of day:', endOfDay);

    const q = query(
      collection(db, 'patients'), // Firestore collection name ('patients' is an example)
      where('createdAt', '>=', startOfDay),
      where('createdAt', '<=', endOfDay),
      orderBy('createdAt', 'asc')
      // Filter based on the date
    );

    const querySnapshot = await getDocs(q);
    const patientsData = querySnapshot.docs.map(doc => doc.data()); // Extract data from docs
    setEntries(patientsData); // Update state with the fetched data
    console.log(patientsData);
  };

  // Handle the download of data as an Excel file
  const handleDownload = () => {

    // Reorganize the data into the correct column order and format createdAt into date and time
    const formattedEntries = entries.map(entry => {
      const createdAtDate = entry.createdAt ? entry.createdAt.toDate() : null;
      const date = createdAtDate ? createdAtDate.toLocaleDateString() : 'N/A'; // Format as Date (e.g., 2/22/2025)
      const time = createdAtDate ? createdAtDate.toLocaleTimeString() : 'N/A'; // Format as Time (e.g., 1:00:00 PM)

      return {
        PatientNo: entry.patientNo,
        Name: entry.name,
        Illness: entry.illness,
        Medicine: entry.medicine,
        Date: date,  // Date in a separate column
        Time: time,  // Time in a separate column
        // Add any other fields here
      };
    });

    const ws = XLSX.utils.json_to_sheet(formattedEntries); // Convert the data to Excel sheet format
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Patient Data"); // Append sheet to the workbook

    // Download the file with the date included in the filename
    XLSX.writeFile(wb, `${currentSelectedDate}_patient_data.xlsx`);
  };

  // Use an effect to trigger download once entries are updated
  useEffect(() => {
    if (entries.length > 0) {
      handleDownload();
    }
  }, [entries]); // Trigger handleDownload when entries change

  // Change URL logic to append a slash
  // Redirect based on environment
  const changeURL = () => {
    let newURL = '';
    
    if (process.env.NODE_ENV === 'development') {
      // In development mode, redirect to localhost:3000/assistant
      newURL = 'http://localhost:3000/assistant';
    } else if (process.env.NODE_ENV === 'production') {
      // In production, redirect to the production URL
      newURL = 'https://newappdoctor.netlify.app/assistant';  // Replace with your actual production URL
    }
    
    // Perform the redirect
    window.location.href = newURL;
  };

  return (
    <div>

      {/* Center-aligned title and button */}
      <Flex direction="column" align="center" justify="center" p={4}>
        <Heading size="xl" mb={4} textAlign="center">
          Assistant App
        </Heading>
        <Button size="xl" colorPalette="teal" onClick={changeURL}>Assistant App</Button>
      </Flex>

      {/* Title */}
      <Box p={4} fontWeight="semibold" letterSpacing="tight">
        <Heading size="xl" mb={0} textAlign="left">
          Download History
        </Heading>
      </Box>

      {/* Container for the list */}
      <Table.ScrollArea borderWidth="1px" rounded="md" height="80vh">
        <Table.Root size="md" stickyHeader marginBottom="120px">
          <Table.Header>
            <Table.Row bg="bg.subtle">
             
              <Table.ColumnHeader>Date</Table.ColumnHeader>
              <Table.ColumnHeader>Count</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" ></Table.ColumnHeader>

            </Table.Row>
          </Table.Header>

          <Table.Body>

          {selectedDate.map((date, index) => (
            <Table.Row key={index}>
              <Table.Cell>{date.date}</Table.Cell>
              <Table.Cell>{date.count} patients</Table.Cell>
              <Table.Cell textAlign="end">
                <Button variant="subtle" onClick={() => fetchData(date.date)}> <DownloadIcon/></Button>
              </Table.Cell>
            </Table.Row>
          ))}

          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {/* Bottom Navigation Bar */}
      <BottomNavigationBar />
    </div>
  );
};

export default downloadpage;
