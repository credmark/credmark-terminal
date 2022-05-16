import {
  Box,
  Button,
  Heading,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UseDisclosureReturn,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { MdArrowForward } from 'react-icons/md';

const faqs = [
  {
    q: <>How do I get access to the API</>,
    a: (
      <>
        You need to choose a membership that awards you with access to the API
        via a separate Access Key NFT.
      </>
    ),
  },
  {
    q: <>What are the differences between the Credmark memberships?</>,
    a: (
      <>
        Depending on the membership you choose, you will have access to
        different products as well as different multipliers for your staking
        rewards.
      </>
    ),
  },
  {
    q: <>How is the price for a membership determined?</>,
    a: (
      <>
        The price itself is set by a governance vote from the Credmark
        community, thus basically all CMK token holders.
      </>
    ),
  },
  {
    q: <>What are the actual costs for a membership?</>,
    a: (
      <>
        Based on the membership you choose, there will be a monthly fee, you
        need to pay in order to get access. This monthly fee is denominated in
        USD but actually paid in CMK based on the current USD conversion rate.
      </>
    ),
  },
  {
    q: <>How can I pay for access?</>,
    a: (
      <>
        Depending on the membership option you have chosen, you can mint your
        access key by providing funds in the form of either USDC, ETH or CMK.
      </>
    ),
  },
  {
    q: <>What happens with my funds?</>,
    a: (
      <>
        If you are providing USDC or ETH, there will be an automated conversion
        into CMK tokens that are then staked to earn rewards for you
        immediately.
      </>
    ),
  },
  {
    q: <>How long will my access be valid?</>,
    a: (
      <>
        Depending on the amount of funds you provided, the period of access
        (determined in days) will be automatically calculated based on the
        current USD conversion rate of CMK. On top of that, the estimated
        staking rewards for your funds will be taken into account as well.
      </>
    ),
  },
  {
    q: <>How can my access be valid forever?</>,
    a: (
      <>
        As long as your monthly CMK staking rewards are higher than the monthly
        cost you pay for your membership,{' '}
        <strong>your access will be valid indefinitely</strong>.
      </>
    ),
  },
  {
    q: <>How does CMK price changes affect my access period?</>,
    a: (
      <>
        Depending on the current conversion rate of CMK against USD, your period
        of access might vary. If the{' '}
        <strong>
          USD-value of CMK goes up, your access period will be prolonged
        </strong>
        . If the USD-value of CMK goes down, your access period will be
        shortened.
      </>
    ),
  },
  {
    q: <>Can I withdraw my staking rewards?</>,
    a: (
      <>
        The rewards you earn are automatically added to your overall CMK balance
        to prolong your access period.
      </>
    ),
  },
  {
    q: <>Can I withdraw my funds?</>,
    a: (
      <>
        You can burn your access key NFT and withdraw your remaining CMK balance
        after the end of any lockup-period but will lose access to the API
        and/or Risk Terminal immediately.
      </>
    ),
  },
];

export default function FaqModal({ isOpen, onClose }: UseDisclosureReturn) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading textAlign="center" fontWeight={300} fontSize="2xl" py="4">
            FAQ
          </Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="6">
            {faqs.map(({ q, a }, index) => (
              <Box key={index}>
                <Text fontWeight="bold">{q}</Text>
                <Text mt="1">{a}</Text>
              </Box>
            ))}
          </VStack>

          <Box mt="12">
            More Questions?{' '}
            <Link
              href="https://credmark.com/faq"
              isExternal
              textDecoration="underline"
            >
              Check our full FAQ <Icon as={MdArrowForward} />
            </Link>
          </Box>
          <Box mt="4">
            <Link
              href="https://discord.com/invite/BJbYSRDdtr"
              isExternal
              textDecoration="underline"
            >
              Visit our Discord
            </Link>{' '}
            to read more, post feedback or join community discussion.{' '}
            <Icon as={MdArrowForward} />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose} variant="ghost">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
