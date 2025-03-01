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
import StatCard from '../components/StatCard'; // Import the StatCard component

import { Drawer, SwipeableDrawer, Typography } from '@mui/material';



// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

import { collection, getDocs, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Import Firestore config

export default function Assistant() {
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

    const audioRef = useRef(); // Create a reference for the audio element

    const [highlightedRow, setHighlightedRow] = useState(null);

    useEffect(() => {
        // Set up a listener that listens to real-time updates from the Firestore collection
        const patientsRef = collection(db, 'patients');
        const q = query(patientsRef, orderBy('createdAt'));  // Query to get all patients ordered by creation time

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Filter and sort the data as needed
            const filteredData = data.filter(item => isCreatedOnDate(item.createdAt, currentDate));  // Filter by date
            const sortedData = filteredData.sort((a, b) => b.patientNo - a.patientNo);  // Sort by patientNo

            setItems(sortedData);

            // Set the next available patient number
            setPatientNo(filteredData.length + 1);
            console.log(audioRef.current)
            // Play sound when data updates
            if (audioRef.current) {
                audioRef.current.play();
            }

            // Automatically highlight the latest row
        if (querySnapshot.docChanges().length > 0) {
            const lastChange = querySnapshot.docChanges()[0];
            if (lastChange.type === "added") {
                const newRowId = lastChange.doc.id;
                setHighlightedRow(newRowId); // Highlight the newly added row

                // Remove the highlight after 3 seconds
                setTimeout(() => {
                    setHighlightedRow(null);
                }, 6000); // 3000ms = 3 seconds
            }
        }

        });

        // Clean up the listener when the component is unmounted
        return () => unsubscribe();
    }, [currentDate]);


    // Load audio file when component mounts
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load(); // Ensure the audio is loaded
        }
    }, []);

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
        setItems(results);
        //setSearchResults(results); // Update search results state
    };

    const handleRowUpdate = (rowId) => {
        setHighlightedRow(rowId); // Set the row as highlighted
        setTimeout(() => {
            setHighlightedRow(null); // Remove the highlight after 3 seconds (adjust as necessary)
        }, 3000); // 3000ms = 3 seconds
    };

    return (
        <>
            {/* Add the audio element in the JSX */}
            <audio ref={audioRef} src="/audio/update-sound.mp3" preload="auto" />

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
                                    <Table.Row
                                    key={item.id}
                                    style={{
                                        backgroundColor: highlightedRow === item.id ? '#ccfbf1' : 'transparent', // Highlight if it matches the highlightedRow
                                        transition: 'background-color 5.3s ease', // Smooth transition for background color
                                    }}
                                    onClick={() => handleRowUpdate(item.id)} // Trigger highlight on row click
                                >
                        
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






            {/* <FloatingActionButton onClick={handleSearchClick} /> */}

        </>
    );
}

