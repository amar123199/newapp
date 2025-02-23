// BottomDrawer.js
import { DrawerRoot, DrawerBackdrop, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, DrawerTitle, DrawerCloseTrigger, Button } from '@chakra-ui/react';

const BottomDrawer = ({ open, onClose }) => {
  return (
    <DrawerRoot open={open} placement="bottom">
      <DrawerBackdrop />
      <DrawerContent 
        roundedTop="lg" 
        zIndex="1000"
        maxHeight="50vh"  // Set max height for drawer content
        height="auto"
      >
        <DrawerHeader>
          <DrawerTitle>Drawer Title</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </DrawerBody>
        <DrawerFooter>
          <DrawerCloseTrigger asChild>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </DrawerCloseTrigger>
          <Button>Save</Button>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default BottomDrawer;
