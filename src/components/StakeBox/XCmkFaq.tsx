import {
  Box,
  Button,
  Heading,
  Icon,
  IconButton,
  Link,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';

export default function XCmkFaq() {
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const onFaqOpen = () => setIsFaqOpen(true);
  const onFaqClose = () => setIsFaqOpen(false);
  const faqInitialFocusRef = useRef(null);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFaqOpen) {
        onFaqClose();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isFaqOpen]);

  return (
    <Popover
      isOpen={isFaqOpen}
      onClose={onFaqClose}
      onOpen={onFaqOpen}
      initialFocusRef={faqInitialFocusRef}
    >
      <PopoverTrigger>
        <Button
          ref={faqInitialFocusRef}
          fontFamily="Credmark Regular"
          colorScheme="purple"
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
          xCMK FAQ
        </Button>
      </PopoverTrigger>
      <PopoverContent
        w="container.md"
        rounded="3xl"
        borderColor="purple.500"
        shadow="2xl"
      >
        <IconButton
          size="sm"
          position="absolute"
          top="-3"
          right="-3"
          colorScheme="purple"
          rounded="full"
          aria-label="Close FAQ"
          fontSize="2xl"
          icon={<Icon as={IoCloseSharp} />}
          onClick={onFaqClose}
          _hover={{
            transform: 'translateY(-2px)',
            shadow: 'lg',
          }}
          _active={{
            transform: 'scale(0.98)',
            boxShadow: 'inner',
          }}
        />
        <PopoverBody p="8">
          <Heading
            as="h2"
            fontSize="3xl"
            textAlign="center"
            color="purple.500"
            fontFamily="Credmark Regular"
          >
            FAQ
          </Heading>
          <VStack color="purple.500" align="flex-start" spacing="6" mt="4">
            <Box>
              <Text fontWeight="bold">
                To what contract are the CMK deployed when I stake?
              </Text>
              <Text>
                The Staking contract and the Rewards Pool contract can be found{' '}
                <Link
                  href="https://github.com/credmark/protocol-core-contracts/blob/main/deploys.md"
                  isExternal
                  textDecoration="underline"
                >
                  here
                </Link>
                .
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Who is responsible for xCMK?</Text>
              <Text>
                xCMK is non-custodial. You are responsible for your xCMK.
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">
                Is there any lock up period for staked CMK or can I unstake at
                any time?
              </Text>
              <Text>
                There is no lockup, you can stake and unstake at any time.
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">When are rewards issued?</Text>
              <Text>
                Rewards are issued during a stake or unstake transaction if at
                least 8 hours have passed since the last reward. This is to keep
                gas fees as low as possible.
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Where can I see my staking rewards?</Text>
              <Text>
                Your staking rewards will be visible on app.credmark.com, along
                with the current exchange ratio of xCMK to CMK. Because xCMK
                appreciates in value compared to CMK, the amount of CMK you get
                for your xCMK increases over time.
              </Text>
            </Box>

            <Box>
              <Text fontWeight="bold">Do staked CMK rewards compound?</Text>
              <Text>xCMK rewards are non-compounding.</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">
                Why is my xCMK balance lower than my CMK balance?
              </Text>
              <Text>
                When you stake your CMK tokens, you “purchase” a share of the
                rewards pool. This share is represented by xCMK.
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Where do staking rewards come from?</Text>
              <Text>
                There is a Rewards pool currently issuing rewards, we have 100k
                CMK in it over 36 days, and will be adding to that number to
                maintain 1M CMK issued annually.
              </Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Can I trade staked CMK / xCMK?</Text>
              <Text>Yes, both are ERC-20 standard tokens.</Text>
            </Box>
            <Text>
              Visit our{' '}
              <Link
                href="https://discord.com/invite/BJbYSRDdtr"
                isExternal
                textDecoration="underline"
                fontWeight="bold"
              >
                Discord
              </Link>{' '}
              to read more, post feedback or join community discussion.
            </Text>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
