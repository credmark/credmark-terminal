import { Img } from '@chakra-ui/image';
import {
  Box,
  Center,
  Container,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/layout';
import { Icon } from '@chakra-ui/react';
import JSBI from 'jsbi';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { IoArrowForward } from 'react-icons/io5';

import Navbar from '~/components/Navbar';
import RiskTerminalData from '~/components/RiskTerminal';
import { useSCmkBalance } from '~/hooks/stats';
import { useActiveWeb3React } from '~/hooks/web3';

export default function TerminalPage() {
  const router = useRouter();
  const { chainId, account } = useActiveWeb3React();
  const sCmkBalance = useSCmkBalance(account);
  const [forceShowRealData, setForceShowRealData] = useState(false);

  const onMainnet = chainId === 1;
  const hasStakedCmk =
    !sCmkBalance.loading &&
    sCmkBalance.value &&
    JSBI.greaterThan(sCmkBalance.value.quotient, JSBI.BigInt(0));

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setForceShowRealData(!forceShowRealData);
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [forceShowRealData]);

  return (
    <VStack
      minH="100vh"
      bg="linear-gradient(135deg, #DE1A600C 0%, #3B00650C 50%, #08538C0C 100%)"
      spacing="8"
    >
      <Navbar />
      <Container
        maxW="container.md"
        pt="8"
        pb="8"
        textAlign="center"
        fontSize="lg"
      >
        <Box bg="pink.50" rounded="lg" p="4" color="pink.500">
          The Risk Terminal is the source of Credmark Data on DeFi Protocols. As
          Credmark conducts Risk Research, the Risk Terminal is the place to
          monitor the data. The Terminal will be updated with additional
          information as we verify our risk reports.
        </Box>
      </Container>
      <Container
        maxW="100vw"
        p="8"
        bg="white"
        roundedTop="3xl"
        position="relative"
        border="1px"
        borderColor="gray.100"
        pb="40"
      >
        <RiskTerminalData
          dummy={!forceShowRealData && (!onMainnet || !hasStakedCmk)}
        />
        {!forceShowRealData && !hasStakedCmk && (
          <Center
            bg="whiteAlpha.700"
            rounded="3xl"
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            zIndex="2"
            backdropFilter="saturate(180%) blur(4px)"
          >
            <VStack
              bg="white"
              rounded="3xl"
              px="24"
              py="4"
              border="1px"
              borderColor="gray.100"
              spacing="4"
              shadow="lg"
              cursor="pointer"
              _hover={{
                shadow: '2xl',
              }}
              _active={{
                transform: 'scale(0.98)',
                shadow: 'md',
              }}
              transitionProperty="common"
              transitionDuration="normal"
              onClick={() => {
                router.push('/?stake=true');
              }}
            >
              <Text
                fontFamily="Credmark Regular"
                color="purple.500"
                fontSize="4xl"
              >
                STAKE CMK
              </Text>
              <HStack spacing="2" justify="center">
                <Img src="/img/cmk.png" h="64px" />
                <Icon as={IoArrowForward} boxSize={12} color="purple.500" />
                <Img src="/img/xcmk.png" h="64px" />
              </HStack>
              <Text
                fontFamily="Credmark Regular"
                color="purple.500"
                fontSize="4xl"
              >
                TO ACCESS
              </Text>
            </VStack>
          </Center>
        )}
      </Container>
    </VStack>
  );
}
