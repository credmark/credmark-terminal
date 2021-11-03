import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  HStack,
  Icon,
  Img,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { IoArrowForward } from 'react-icons/io5';

import { useActiveWeb3React } from '~/hooks/web3';
import { useWalletModalToggle } from '~/state/application/hooks';

export default function MintBox() {
  const { isOpen, onOpen } = useDisclosure();
  const { account } = useActiveWeb3React();
  const toggleWalletModal = useWalletModalToggle();

  return (
    <VStack
      w={isOpen ? 'container.md' : 'md'}
      px="8"
      py={isOpen ? 16 : 8}
      bg="white"
      shadow={isOpen ? 'xl' : 'lg'}
      rounded="3xl"
      spacing="6"
      cursor={isOpen ? undefined : 'pointer'}
      _hover={
        isOpen
          ? {}
          : {
              shadow: '2xl',
            }
      }
      transitionProperty="width,height,box-shadow"
      transitionDuration="normal"
      onClick={onOpen}
    >
      <HStack spacing="4">
        <Collapse in={isOpen}>
          <HStack spacing="4">
            <Img src="/img/scmk.png" w="20" />
            <Icon as={IoArrowForward} boxSize={12} color="purple.500" />
          </HStack>
        </Collapse>
        <Img src="/img/key.png" w="20" />
      </HStack>
      <Text
        fontFamily="Credmark Regular"
        textAlign="center"
        bgGradient="linear(135deg, #3D0066, #0A528C)"
        bgClip="text"
        lineHeight="1.2"
      >
        <Text as="span" fontSize="4xl">
          STAKE CMK
        </Text>
        <br />
        <Text as="span" fontSize="xl">
          TO MINT
        </Text>
        <br />
        <Text as="span" fontSize="4xl">
          ACCESS KEY
        </Text>
      </Text>
      <Collapse in={isOpen}>
        <VStack spacing="8">
          <Text color="purple.500" textAlign="center" maxW="sm">
            Stake at least <strong>100 CMK</strong> to mint an{' '}
            <strong>Access Key</strong>. Earn rewards on your
            <strong>staked CMK</strong> (sCMK) and receive access to the{' '}
            <strong>Terminal</strong>
          </Text>
          {!account ? (
            <Button
              colorScheme="purple"
              size="lg"
              px="12"
              rounded="2xl"
              _hover={{
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }}
              _active={{
                transform: 'scale(0.98)',
                boxShadow: 'inner',
              }}
              onClick={toggleWalletModal}
            >
              CONNECT WALLET
            </Button>
          ) : (
            <VStack>
              <InputGroup w="md" shadow="lg" mb="4" size="lg" rounded="lg">
                <Input
                  borderWidth="0"
                  placeholder="999.99"
                  textAlign="center"
                />
                <InputRightElement>
                  <ButtonGroup pr="4">
                    <Button size="sm" variant="ghost" color="gray.400">
                      MAX
                    </Button>
                  </ButtonGroup>
                </InputRightElement>
              </InputGroup>

              <Button
                colorScheme="purple"
                size="lg"
                w="200px"
                rounded="2xl"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                _active={{
                  transform: 'scale(0.98)',
                  boxShadow: 'inner',
                }}
              >
                STAKE CMK
              </Button>
              <Button
                isDisabled
                colorScheme="purple"
                size="lg"
                w="200px"
                rounded="2xl"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                _active={{
                  transform: 'scale(0.98)',
                  boxShadow: 'inner',
                }}
              >
                UNSTAKE
              </Button>
            </VStack>
          )}
          <Box whiteSpace="nowrap" w="100%">
            <HStack my="2">
              <Text
                flex="1"
                textAlign="right"
                color="purple.500"
                fontWeight="300"
              >
                Staking APY
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                123.12%
              </Text>
            </HStack>
            <HStack my="2">
              <Text
                flex="1"
                textAlign="right"
                color="purple.500"
                fontWeight="300"
              >
                Total Value Deposited
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                $123,456.78
              </Text>
            </HStack>
            <HStack my="2">
              <Text
                flex="1"
                textAlign="right"
                color="purple.500"
                fontWeight="300"
              >
                % of CMK Staked
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                12.23%
              </Text>
            </HStack>
            <HStack my="2">
              <Text
                flex="1"
                textAlign="right"
                color="purple.500"
                fontWeight="300"
              >
                Total Keys Minted
              </Text>
              <Text flex="1" color="purple.500" fontWeight="700">
                67
              </Text>
            </HStack>
          </Box>
        </VStack>
      </Collapse>
    </VStack>
  );
}
