import { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';  // Importing the swipeable hook
import {
  Table, Stat, Box, Input, FormControl, Stack, DrawerActionTrigger, Text, Separator, ButtonGroup, Textarea,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, StackSeparator
} from '@chakra-ui/react';
import { Field } from '../components/ui/field';
import { motion, AnimatePresence } from 'framer-motion'; // Importing framer-motion for animations
import BottomNavigationBar from '../components/BottomNavigationBar';
import FloatingActionButton from '../components/FloatingActionButton';
import AddActionButton from '../components/AddActionButton';
import ResetActionButton from '../components/ResetActionButton';
import StatCard from '../components/StatCard'; // Import the StatCard component

import { Drawer, SwipeableDrawer, Typography } from '@mui/material';



// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

import { collection, getDocs, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firestore config






export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [swipeDirection, setSwipeDirection] = useState(0); // Track swipe direction
  const [open, setOpen] = useState(false)

  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState(false); // Track search bar visibility

  const nameInputRef = useRef(null); // Create a reference for the input
  // Inside your component
  const searchTimeoutRef = useRef(null);

  const [name, setName] = useState('');
  const [illness, setIllness] = useState('');
  const [medicine, setMedicine] = useState('');

  const [items, setItems] = useState([]);
  const [patientNo, setPatientNo] = useState(0); // Track the patient number

  const [speechTranscript, setSpeechTranscript] = useState(''); // To store the transcript
  const [isListening, setIsListening] = useState(false); // To track the listening state
  const [activeField, setActiveField] = useState(''); // Track active input
  // Initialize SpeechRecognition
  const recognition = useRef(null);

  useEffect(() => {


    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, "patients")); // Firestore collection name
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filter data to only include entries created on the selected date (currentDate)
    const filteredData = data.filter(item => isCreatedOnDate(item.createdAt, currentDate));

    // Sort the filtered data by patientNo in ascending order
    const sortedData = filteredData.sort((a, b) => b.patientNo - a.patientNo);

    setItems(sortedData);

    // Set the patient number to be the next available number (i.e., current patient count + 1)
    setPatientNo(filteredData.length + 1);
  };

  // Helper function to compare if the document's createdAt date matches the currentDate
  const isCreatedOnDate = (createdAt, targetDate) => {
    // Check if createdAt exists and is a Firestore timestamp (check if 'seconds' exists)
    if (!createdAt || !createdAt.seconds) {
      console.error("Invalid createdAt field:", createdAt); // Log if something is wrong with createdAt
      return false; // Return false if createdAt is not defined or invalid
    }

    const target = new Date(targetDate); // The selected target date (currentDate)
    const createdDate = new Date(createdAt.seconds * 1000); // Firebase stores timestamp in seconds

    // Compare the year, month, and date parts of the date
    return target.getFullYear() === createdDate.getFullYear() &&
      target.getMonth() === createdDate.getMonth() &&
      target.getDate() === createdDate.getDate();
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleDateChange(1, 100),
    onSwipedRight: () => handleDateChange(-1, -100),
    trackMouse: true
  });

  const handleDateChange = (days, direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    // Check if the new date is in the future
    if (newDate > new Date()) {
      newDate.setDate(new Date().getDate());  // Set the date to today if it's in the future
    }

    setCurrentDate(newDate);
    setSwipeDirection(direction); // Set the direction for animation
    console.log(currentDate)
  };

  const formatDate = (date) => {
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

    // Format the date
    const options = { month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    // Return the custom formatted string
    if (diffDays === 0) {
      return `Today, ${formattedDate}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${formattedDate}`;
    } else {
      return `${diffDays} Days ago, ${formattedDate}`;
    }
  };

  const formattedDate = formatDate(currentDate);

  // FAB click handler with an alert
  const handleFabClick = () => {
    toggleSearchDrawer();
    //alert('Floating Action Button clicked!');
    setOpen(!open); // Open the drawer
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus(); // Focus on the name input field when drawer opens
      }
    }, 2);  // Adjust delay as needed for your animation duration
  };

  // Function to open the search drawer
  const handleSearchClick = () => {
    setSearch(!search); // Toggle the search input visibility
    //setSearch(true);  // Open the drawer
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();  // Focus on the input when the drawer opens
      }
    }, 100);  // Small delay to make sure the drawer is fully opened
  };

  const toggleDrawer = () => {
    setOpen(false);
    setSearch(false);
  };

  const toggleSearchDrawer = () => {
    setOpen(false);
    setSearch(false);
    setSearchName(''); // Clear the search input when closing
    fetchData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Capitalize the first letter of the name
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

    console.log({ capitalizedName, illness, medicine });

    if (!capitalizedName || !illness || !medicine) {
      alert("Please fill all fields before saving.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "patients"), {
        name: capitalizedName,
        illness,
        medicine,
        createdAt: new Date(), // Timestamp
        patientNo: patientNo,  // Assign the patient number
      });

      console.log("Document written with ID: ", docRef.id);

      // Update local state to reflect new patient, converting the createdAt to a valid Date object
      const newPatient = {
        id: docRef.id,
        name: capitalizedName,
        illness,
        medicine,
        patientNo,
        createdAt: new Date() // Ensure it's converted to a JavaScript Date object
      };

      // Update local state to reflect new patient
      setItems(prevItems => [...prevItems, newPatient]); // Update state with new patient
      setPatientNo(patientNo + 1);

      // After adding, trigger a fresh data fetch to update the UI
      fetchData();

      // Reset input fields
      setName("");
      setIllness("");
      setMedicine("");
      setOpen(false); // Close the drawer
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    // You can add your save functionality here, like sending data to an API or saving locally
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchName(value); // Update the search term

    // Clear the previous timeout to prevent multiple searches being triggered
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout to call the search function after 300ms (adjust as needed)
    searchTimeoutRef.current = setTimeout(() => {
      handleSearchSubmit(e); // Trigger the search after the debounce delay
    }, 300); // Adjust the delay as needed (e.g., 300ms)
  };

  const handleSearchSubmit = async (e) => {

    e.preventDefault();
    let value = e.target.value;
    // Capitalize the first letter and make the rest lowercase
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    console.log(value);

    if (!value) return; // Do nothing if search input is empty

    // Firestore query to fetch names that start with the search text
    const q = query(
      collection(db, "patients"), // Firestore collection
      orderBy("name"), // Order by the name field
      where("name", ">=", value), // Find names starting with the search text
      where("name", "<=", value + "\uf8ff") // Include names with additional characters after the search text
    );

    const querySnapshot = await getDocs(q);

    // Process data and add relative time
    const results = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const createdAt = new Date(data.createdAt.seconds * 1000); // Firebase timestamp
      return {
        id: doc.id,
        patientNo: data.patientNo,
        name: data.name,
        illness: data.illness,
        medicine: data.medicine,
        createdAt: data.createdAt,
        relativeTime: formatDate(createdAt),
      };
    });

    // Sort the results in descending order based on the createdAt field (latest first)
    const sortedResults = results.sort((a, b) => b.createdAt - a.createdAt);

    setItems(sortedResults);
    //setSearchResults(results); // Update search results state
  };

  const resetToToday = () => {
    const today = new Date();
    setCurrentDate(today); // Reset to today's date
    fetchData(); // Fetch data based on today's date
  };

  useEffect(() => {
    // Initialize SpeechRecognition on component mount
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.current.lang = 'en-US'; // Set the language
      recognition.current.interimResults = true; // Get real-time results
      recognition.current.maxAlternatives = 1; // Get only the best result

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Transcript:', transcript); // Log the transcript to the console
        setSpeechTranscript(transcript); // Update the speech transcript in the state   
      };

      recognition.current.onend = () => {
        setIsListening(false); // Set listening state to false when recognition ends
        console.log('Speech recognition stopped');
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    } else {
      console.log('SpeechRecognition is not supported in this browser.');
    }

    // Cleanup on component unmount
    return () => {
      if (recognition.current) {
        recognition.current.onresult = null;
        recognition.current.onend = null;
        recognition.current.onerror = null;
      }
    };
  }, []);

  useEffect(()=>{
   console.log(speechTranscript+"working")
   if(activeField==="name") setName(speechTranscript);
   if(activeField=="illness") setIllness(speechTranscript);
   if(activeField=="medicine") setMedicine(speechTranscript);
  },[speechTranscript])

  const handleStartListeningName = () => {
    if (recognition.current) {
      recognition.current.start();
      setIsListening(true); // Set listening state to true
      setActiveField("name");
      console.log('Speech recognition started');
      
    }
  };
  const handleStartListeningIllness = () => {
    if (recognition.current) {
      recognition.current.start();
      setIsListening(true); // Set listening state to true
      setActiveField("illness")
      console.log('Speech recognition started illness');

    }
  };

  const handleStartListeningMedicine = () => {
    if (recognition.current) {
      recognition.current.start();
      setIsListening(true); // Set listening state to true
      setActiveField("medicine")
      console.log('Speech recognition started');

    }
  };

  const handleStopListening = () => {
    if (recognition.current) {
      recognition.current.stop(); // Stop the recognition
      setIsListening(false); // Set listening state to false
      console.log('Speech recognition stopped');
    }
  };


  return (
    <>
      <div>
        <Box {...handlers} p={6} bg="bg.surface" cursor="grab" overflow="hidden" >
          <AnimatePresence mode="wait">
            <motion.div
              key={formattedDate}
              initial={{ opacity: 0, x: swipeDirection }} // Use swipeDirection here
              animate={{ opacity: 1, x: 0 }}  // Animate to the center
              exit={{ opacity: 0, x: -swipeDirection }} // Exit in the same direction
              transition={{
                duration: 0.0, // Short transition time
                ease: "easeInOut", // This removes the springiness
              }}
            >

              <Stat.Root>
                <Stat.Label>Selected Date</Stat.Label>
                <Stat.ValueText>{formattedDate}</Stat.ValueText>
              </Stat.Root>
            </motion.div>
          </AnimatePresence>
        </Box>
        <FloatingActionButton onClick={handleSearchClick} />
      </div>

      <Table.ScrollArea borderWidth="1px" rounded="md" height="80vh">
        <Table.Root size="md" stickyHeader marginBottom="120px">
          <Table.Header>
            <Table.Row bg="bg.subtle">
              <Table.ColumnHeader textAlign="center">No.</Table.ColumnHeader>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              {search && (
                <>
                  <Table.ColumnHeader>Date</Table.ColumnHeader>
                </>
              )}

              <Table.ColumnHeader>Time</Table.ColumnHeader>
              <Table.ColumnHeader>Illness</Table.ColumnHeader>
              <Table.ColumnHeader>Medicine</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end"></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell textAlign="center">{item.patientNo}</Table.Cell>
                <Table.Cell>{item.name}</Table.Cell>
                {search && (
                  <>
                    <Table.Cell>
                      {item.createdAt && item.createdAt.toDate ?
                        item.createdAt.toDate().toLocaleDateString("en-GB", { day: "numeric", month: "short" }) :
                        "Invalid Date"}
                    </Table.Cell>
                  </>
                )}

                <Table.Cell>
                  {item.createdAt && item.createdAt.toDate ?
                    item.createdAt.toDate().toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true
                    }) :
                    "Invalid Time"}
                </Table.Cell>
                <Table.Cell>{item.illness}</Table.Cell>
                <Table.Cell>{item.medicine}</Table.Cell>
                <Table.Cell textAlign="end">---</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      <BottomNavigationBar onSearchClick={handleFabClick} />

      {/* Drawer component */}
      <Drawer
        anchor='top'
        open={open}
        onClose={toggleDrawer}

      >

        <form onSubmit={handleSubmit}>
          <Stack gap={5} p={6} >  {/* Added padding to the Stack */}
            <box>
              <Text fontSize="sm">Patient No</Text> {/* Small font size for label */}
              <Text fontSize="3xl" fontWeight="bold">{patientNo}</Text> {/* Large number below Patient No */}
            </box>


            <Field label="Name" required>
              <Input
                variant="subtle"
                size="lg"
                placeholder="Enter Name"
                value={name}  // Bind the value of the input to the state
                onChange={(e) => setName(e.target.value)}  // Update state on change
              />
            </Field>
            <Button
            onClick={handleStartListeningName}
            
              disabled={isListening} >Name</Button>
           
            <Field label="Illness" required>
              <Input
                variant="subtle"
                size="lg"
                placeholder="Enter Illness"
                value={illness}  // Bind the value of the input to the state
                onChange={(e) => setIllness(e.target.value)}  // Update state on change
              />
            </Field>
            <Button
            onClick={handleStartListeningIllness}
            
              disabled={isListening} >Illness</Button>

            <Field label="Medicine / Remarks" required>
              <Textarea
                variant="subtle"
                size="lg"
                placeholder="Enter Medicine"
                value={medicine}  // Bind the value of the input to the state
                onChange={(e) => setMedicine(e.target.value)}  // Update state on change
              />
            </Field>
            <Button
            onClick={handleStartListeningMedicine}
            
              disabled={isListening} >Medicine</Button>
            <Separator />

            <Stack direction="row" justify="space-between" align="center">
              <ButtonGroup width="100%">
                <Button size="lg" variant="subtle" flex="1" onClick={toggleDrawer} >Close</Button>
                <Button size="lg" colorPalette="teal" flex="1" type="submit">
                  Save
                </Button>
              </ButtonGroup>

            </Stack>

          </Stack>
        </form>
      </Drawer>



      {/* Fixed Search Bar */}
      {search && (
        <div style={{ position: 'fixed', top: 0, width: '100%', padding: '30px 16px', backgroundColor: 'white', zIndex: 2000 }}>

          <Stack direction="row" spacing={4}>
            <Input
              ref={nameInputRef}
              placeholder="Search Name"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value); // Update the search input
                handleSearchChange(e); // Call the submit handler on every keypress
              }}

            />
            <Button colorScheme="teal" type="submit" onClick={toggleSearchDrawer}>
              Close
            </Button>
          </Stack>

        </div>
      )}
      {/* <div style={{position:"absolute"}}>
        <DrawerRoot open={open} placement="bottom">
          <DrawerBackdrop />
          <DrawerContent roundedTop="lg" bottom="0" zIndex="2000" >
            <DrawerHeader>
              <DrawerTitle>Drawer Title</DrawerTitle>
            </DrawerHeader>
            <DrawerBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </DrawerBody>
            <DrawerFooter>
              <DrawerCloseTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerCloseTrigger>
              <Button>Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerRoot>
        </div> */}

      {/* <Stat.Root>
          <Stat.Label>today</Stat.Label>
          <Stat.ValueText>{formattedDate}</Stat.ValueText>
        </Stat.Root>

        <Stat.Root>
          <Stat.Label>Yesterday</Stat.Label>
          <Stat.ValueText>Yesterdat</Stat.ValueText>
        </Stat.Root> */}




      {new Date().toDateString() === currentDate.toDateString() && <AddActionButton onClick={handleFabClick} />}
      {new Date().toDateString() !== currentDate.toDateString() && <ResetActionButton onClick={resetToToday} />}


      {/* <FloatingActionButton onClick={handleSearchClick} /> */}

    </>
  );
}

