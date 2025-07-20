"use client";

import { ChakraProvider, ColorModeScript, Flex, Box } from "@chakra-ui/react";
import theme from "@/styles/theme";
import { Header } from "@/components";

export default function ClientRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <Header />
        <Flex direction="column" minH="100vh" minWidth="300px">
          <Box
            as="main"
            flex="1"
            pt="64px"
            pl="20px"
            pr="20px"
            pb="60px"
            className="container mx-auto p-4"
          >
            {children}
          </Box>
        </Flex>
      </ChakraProvider>
    </>
  );
}
