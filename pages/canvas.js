"use client";
import { useState, useRef } from "react";
import CanvasDraw from "react-canvas-draw";
import Tesseract from "tesseract.js";
import levenshtein from "fast-levenshtein";
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
  DrawerTrigger, Button, Modal,HStack,VStack, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  StackSeparator, Heading
} from '@chakra-ui/react';

// List of predefined medical terms
const medicalWords = [
    "Illness", "Puo", "Pain", "Der", "Poo", "Cough", "Wonds", "Deri",
    "Nousea", "Fever", "Medicine", "Afst", "Afst mr", "Adl", "Afsr",
    "Syp", "Inj emset", "Anx","Amar"
  ];

// Function to find the closest match using Levenshtein distance
const findClosestMatch = (inputText) => {
    let closestWord = inputText;
    let minDistance = Infinity;
  
    medicalWords.forEach((word) => {
      const distance = levenshtein.get(inputText.toLowerCase(), word.toLowerCase());
      if (distance < minDistance) {
        minDistance = distance;
        closestWord = word;
      }
    });
  
    return minDistance <= 2 ? closestWord : inputText; // Allow max 2 edits for a match
  };

export default function HandwritingRecognition() {
  const [recognizedText, setRecognizedText] = useState("");
  const [matchedWord, setMatchedWord] = useState("");
  const canvasRef = useRef(null);

  const handleExtractText = () => {
    if (canvasRef.current) {
      const dataURL = canvasRef.current.getDataURL(); // Get the drawing as an image
      recognizeText(dataURL);
    }
  };

  const handleEraseCanvas = () => {
    setRecognizedText("");
    setMatchedWord("");
    if (canvasRef.current) {
      canvasRef.current.clear(); // Clears the canvas
    }
  };

  const recognizeText = (imageData) => {
    Tesseract.recognize(
      imageData,
      "eng", // Language
      {
        logger: (m) => console.log(m), // Logs progress
      }
    )
      .then(({ data: { text } }) => {
        const cleanedText = text.trim(); // Remove extra spaces/newlines
        setRecognizedText(cleanedText);
        setMatchedWord(findClosestMatch(cleanedText)); // Find closest word match
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-bold">Draw & Recognize Handwriting</h2>
      <HStack p={4}>
      <Button size="2xl" variant="solid" colorPalette="teal" onClick={handleExtractText}>
        Extract Text
      </Button>
      <Button size="2xl"  variant="subtle" onClick={handleEraseCanvas}>
       🧹Erase Canvas
      </Button>
      </HStack>
      
      <VStack backgroundColor="teal.100" p={4} alignItems="start">
        <Heading size="4xl">{recognizedText}</Heading>
        <Heading color="teal.600" size="6xl">{matchedWord}</Heading>
      </VStack>

      <CanvasDraw
        ref={canvasRef}
        brushColor="black"
        brushRadius={3}
        canvasWidth={400}
        canvasHeight={600}
        hideGrid={false}
        lazyRadius={0}
      />
    </div>
  );
}
