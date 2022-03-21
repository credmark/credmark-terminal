import { InfoIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Box,
  Img,
  Container,
  Stack,
  HStack,
  Text,
  Center,
  Button,
} from '@chakra-ui/react';
import React from 'react';

function Rewards() {
  return (
    <Container maxW="container.lg" centerContent>
      <Box pt={10} pb={10}>
        <Center
          fontSize={{ base: 'large', md: 'xx-large' }}
          fontWeight="semibold"
          textAlign="center"
        >
          Choose a Tier to Gain Access to our Tools and Start
        </Center>
        <Center fontSize={{ base: 'large', md: 'xx-large' }}>
          Earning Rewards
        </Center>
      </Box>
      <Stack direction={['column', 'row']} spacing="24px">
        <Box
          w={{ base: '300px', md: '250px' }}
          boxShadow="xl"
          bg="white"
          borderRadius="7px"
        >
          <Center color="black" fontSize="xl" fontWeight={500} h="60px">
            Starter
          </Center>
          <Center color="black" fontSize="xl" fontWeight={400} mt="5">
            1X
          </Center>
          <Center color="black" fontSize="18px" fontWeight={400}>
            Staking Rewards
          </Center>
          <Box maxW="container.sm" pl="5" mt="5">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/credmark.svg" />
              <Text fontSize={13}>Stake CMK</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/dollar.svg" />
              <Text fontSize={13}>free</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/unlock.svg" />
              <Text fontSize={13}>No Lockup Period </Text>
            </HStack>
          </Box>
          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/code.svg" />
              <Text fontSize={13}>Model Framework </Text>
            </HStack>
          </Box>
          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px" color={'#e6e6e6'}>
              <Img src="/img/apiPortal/disabled_pc.svg" />
              <Text fontSize={13}>Risk Terminal Access</Text>
              <InfoIcon />
            </HStack>
          </Box>
          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px" color={'#e6e6e6'}>
              <Img src="/img/apiPortal/disabled_gateway.svg" />
              <Text fontSize={13}>API Gateway Access</Text>
              <InfoIcon />
            </HStack>
          </Box>
          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px" color={'#e6e6e6'}>
              <Img src="/img/apiPortal/disabled_report.svg" />
              <Text fontSize={13}>Custom Models & Reports</Text>
              <InfoIcon />
            </HStack>
          </Box>
          <Box maxW="container.sm" mt="5" mb={10}>
            <Center>
              <Button
                colorScheme="#71478f"
                color={'#71478f'}
                variant="outline"
                width={'70%'}
              >
                Free
              </Button>
            </Center>
          </Box>
        </Box>
        <Box
          w={{ base: '300px', md: '250px' }}
          boxShadow="xl"
          bg="white"
          borderRadius="7px"
        >
          <Center color="black" fontSize="xl" fontWeight={500} h="60px">
            Pro
          </Center>
          <Center color="black" fontSize="xl" fontWeight={400} mt="5">
            2X
          </Center>
          <Center color="black" fontSize="18px" fontWeight={400}>
            Staking Rewards
          </Center>
          <Box maxW="container.sm" pl="5" mt="5">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/credmark.svg" />
              <Text fontSize={13}>Stake CMK</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/dollar.svg" />
              <Text fontSize={13}>$35 per month*</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/filled_lock.svg" />
              <Text fontSize={13}>1 Week Lookup Period</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/code.svg" />
              <Text fontSize={13}>Model Framework</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/pc.svg" />

              <Text fontSize={13}>Risk Terminal Access</Text>
            </HStack>
          </Box>
          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px" color={'#e6e6e6'}>
              <Img src="/img/apiPortal/disabled_gateway.svg" />
              <Text fontSize={13}>API Gateway Access</Text>
              <InfoIcon />
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px" color={'#e6e6e6'}>
              <Img src="/img/apiPortal/disabled_report.svg" />
              <Text fontSize={13}>Custom Models & Reports</Text>
              <InfoIcon />
            </HStack>
          </Box>

          <Box maxW="container.sm" mt="5" mb={10}>
            <Center>
              <Button
                colorScheme="#71478f"
                color={'#71478f'}
                variant="outline"
                width={'70%'}
              >
                $50 per month<span>*</span>{' '}
                <span>
                  <ArrowForwardIcon />
                </span>
              </Button>
            </Center>
          </Box>
        </Box>
        <Box
          w={{ base: '300px', md: '250px' }}
          boxShadow="xl"
          bg="white"
          borderRadius="7px"
        >
          <Center
            color="white"
            fontSize="xl"
            fontWeight={500}
            bgColor="#de1a60"
            h="60px"
            borderTopRightRadius="7px"
            borderTopLeftRadius="7px"
          >
            Unlimited
          </Center>
          <Center color="black" fontSize="xl" fontWeight={400} mt="5">
            3X
          </Center>
          <Center color="black" fontSize="18px" fontWeight={400}>
            Staking Rewards
          </Center>
          <Box maxW="container.sm" pl="5" mt="5">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/credmark.svg" />
              <Text fontSize={13}>Stake CMK</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="img/apiPortal/dollar.svg" />
              <Text fontSize={13}>$350 per month*</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/filled_lock.svg" />
              <Text fontSize={13}>1 Month Lookup Period</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/code.svg" />
              <Text fontSize={13}>Mode Framework</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/pc.svg" />
              <Text fontSize={13}>Risk Terminal Access</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/gateway.svg" />
              <Text fontSize={13}>API Gateway Access</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px" color={'#e6e6e6'}>
              <Img src="/img/apiPortal/disabled_report.svg" />
              <Text fontSize={13}>Custom Model & Reports</Text>
              <InfoIcon />
            </HStack>
          </Box>

          <Box maxW="container.sm" mt="5" mb={10}>
            <Center>
              <Button
                bgColor="#de1a60"
                color={'white'}
                variant="outline"
                width={'70%'}
              >
                $100 per month<span>*</span>{' '}
                <span>
                  <ArrowForwardIcon />
                </span>
              </Button>
            </Center>
          </Box>
        </Box>
        <Box
          w={{ base: '300px', md: '250px' }}
          boxShadow="xl"
          bg="white"
          borderRadius="7px"
        >
          <Center
            color="black"
            fontSize="xl"
            fontWeight={500}
            h="60px"
            borderTopRightRadius="7px"
            borderTopLeftRadius="7px"
          >
            Premium
          </Center>
          <Center color="black" fontSize="xl" fontWeight={400} mt="5">
            4X
          </Center>
          <Center color="black" fontSize="18px" fontWeight={400}>
            Staking Rewards
          </Center>
          <Box maxW="container.sm" pl="5" mt="5">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/credmark.svg" />
              <Text fontSize={13}>Stake CMK</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/dollar.svg" />
              <Text fontSize={13}>$3,500 per month*</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/filled_lock.svg" />
              <Text fontSize={13}>1 Year Lookup Period</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/code.svg" />
              <Text fontSize={13}>Model Framework</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/pc.svg" />
              <Text fontSize={13}>Risk Terminal Access</Text>
            </HStack>
          </Box>
          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/gateway.svg" />
              <Text fontSize={13}>API Gateway Access</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" pl="5" mt="3">
            <HStack spacing="10px">
              <Img src="/img/apiPortal/report.svg" />
              <Text fontSize={13}>Custom Model & Reports</Text>
            </HStack>
          </Box>

          <Box maxW="container.sm" mt="5" mb={10}>
            <Center>
              <Button
                colorScheme="#71478f"
                color={'#71478f'}
                variant="outline"
                width={'70%'}
              >
                $100 per month*
                <ArrowForwardIcon />
              </Button>
            </Center>
          </Box>
        </Box>
      </Stack>
      <Box pt={5} pb={5}>
        <Text
          fontSize="16px"
          textAlign={'center'}
          fontWeight={500}
          color={'#989898'}
        >
          Need Help? Check Out Our FAQ <ArrowForwardIcon />
        </Text>
        <Text
          fontSize="12px"
          textAlign={'center'}
          fontWeight={400}
          color={'#bbbbbb'}
        >
          *Costs are denominated in USD, and access is stored as staked amount
        </Text>
        <Text
          fontSize="12px"
          textAlign={'center'}
          fontWeight={400}
          color={'#bbbbbb'}
        >
          in the price are subject to a DAO Governance Vote. Depending on the
          amount{' '}
        </Text>
        <Text
          fontSize="12px"
          textAlign={'center'}
          fontWeight={400}
          color={'#bbbbbb'}
        >
          staked, staking rewards may exceed monthly costs.{' '}
        </Text>
      </Box>
      <Box p={5}></Box>
    </Container>
  );
}

export default Rewards;
