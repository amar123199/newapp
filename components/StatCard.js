// components/StatCard.js
import { Stat } from "@chakra-ui/react"

const StatCard = () => {
  return (
    <Stat.Root>
    <Stat.Label>Unique visitors</Stat.Label>
    <Stat.ValueText>192.1k</Stat.ValueText>
  </Stat.Root>
  );
};

export default StatCard;
