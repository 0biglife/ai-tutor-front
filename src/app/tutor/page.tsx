import { TutorContainer } from "@/components";
import { Container } from "@chakra-ui/react";

export default async function TutorPage() {
  return (
    <Container maxW="container.xl" px={{ base: 4, md: 8 }} py={8}>
      <TutorContainer />
    </Container>
  );
}
