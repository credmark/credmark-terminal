import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Button,
  Center,
  Collapse,
  Container,
  Flex,
  HStack,
  Icon,
  Input,
  Link,
  Text,
  useDisclosure,
  useOutsideClick,
  VStack,
} from '@chakra-ui/react';
import { CurrencyAmount } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo, useRef, useState } from 'react';
import {
  MdApi,
  MdArrowBack,
  MdArrowForward,
  MdAutoAwesome,
  MdCode,
  MdLock,
  MdLockOpen,
  MdTrendingUp,
  MdUnfoldMore,
} from 'react-icons/md';

import FaqModal from '~/components/ApiPortal/FaqModal';
import _MintChart from '~/components/ApiPortal/MintChart';
import { CmkLogoIcon, CmkTerminalIcon } from '~/components/Icons';
import EtherscanLogoIcon from '~/components/Icons/EtherscanLogoIcon';
import { isValidTierKey, TierKey, TIERS } from '~/constants/tiers';
import { CMK, USDC } from '~/constants/tokens';
import useUSDCPrice from '~/hooks/useUSDCPrice';
import { useActiveWeb3React } from '~/hooks/web3';
import { useHiddenSidebar } from '~/state/application/hooks';
import { tryParseAmount } from '~/utils/tryParseAmount';

const MintChart = React.memo(
  _MintChart,
  (prevProps, nextProps) =>
    prevProps.activeTier.label === nextProps.activeTier.label &&
    prevProps.selectedAmount === nextProps.selectedAmount &&
    JSBI.equal(prevProps.rewardCmkPerSecond, nextProps.rewardCmkPerSecond) &&
    JSBI.equal(prevProps.totalCmkShares, nextProps.totalCmkShares),
);

const SEC_IN_YEAR = 365 * 24 * 3600;

export default function ApiAccessMintPage() {
  useHiddenSidebar(true);

  const { chainId, library, account } = useActiveWeb3React();

  const router = useRouter();
  const tierSelectorRef = useRef(null);
  const [showTierSelection, setShowTierSelection] = useState(false);
  const faq = useDisclosure();

  useOutsideClick({
    ref: tierSelectorRef,
    enabled: showTierSelection,
    handler: () => setShowTierSelection(false),
  });

  const [activeTierKey, setActiveTierKey] = useState<TierKey>(
    typeof router.query.tier === 'string' && isValidTierKey(router.query.tier)
      ? router.query.tier
      : 'BUIDL',
  );

  const activeTier = useMemo(() => {
    const tier = TIERS.find(({ label }) => label === activeTierKey);
    if (!tier) {
      throw new Error('Invalid tier key selected');
    }

    return tier;
  }, [activeTierKey]);

  const cmk = chainId ? CMK[chainId] : undefined;
  const usdc = chainId ? USDC[chainId] : undefined;

  const usdcPrice = useUSDCPrice(cmk);

  const [usdcAmount, setUsdcAmount] = useState('0');
  const [cmkAmount, setCmkAmount] = useState('0');

  const rewardCmkPerSecond = JSBI.multiply(
    JSBI.BigInt(10),
    JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(17)),
  );

  const totalCmkShares = JSBI.multiply(
    JSBI.BigInt(10_000_000),
    JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18)),
  );

  const cmkSharesToMint = useMemo(() => {
    const parsedCmkAmount = tryParseAmount(cmkAmount, cmk);
    if (parsedCmkAmount) {
      return JSBI.multiply(
        parsedCmkAmount.quotient,
        JSBI.BigInt(activeTier.rewardMultiplier),
      );
    }

    return JSBI.BigInt(0);
  }, [activeTier, cmk, cmkAmount]);

  const stakingApy = useMemo(
    () =>
      JSBI.divide(
        JSBI.multiply(
          rewardCmkPerSecond,
          JSBI.multiply(JSBI.BigInt(SEC_IN_YEAR), JSBI.BigInt(100)),
        ),
        JSBI.add(totalCmkShares, cmkSharesToMint),
      ),
    [cmkSharesToMint, rewardCmkPerSecond, totalCmkShares],
  );

  const monthlyRewardUsdc = useMemo(() => {
    const monthlyRewardCmk = JSBI.divide(
      JSBI.multiply(
        JSBI.multiply(cmkSharesToMint, rewardCmkPerSecond),
        JSBI.BigInt(30 * 24 * 3600),
      ),
      JSBI.add(totalCmkShares, cmkSharesToMint),
    );

    if (usdcPrice && cmk) {
      return usdcPrice
        .quote(CurrencyAmount.fromRawAmount(cmk, monthlyRewardCmk.toString()))
        .toFixed(0);
    }

    return '0';
  }, [cmk, cmkSharesToMint, rewardCmkPerSecond, totalCmkShares, usdcPrice]);

  const daysAccess = useMemo(() => {
    const dailyFee = activeTier.monthlyFeeUsd / 30;
    const dailyReward = Number(monthlyRewardUsdc) / 30;

    const dailyReturn = dailyFee - dailyReward;
    if (dailyReturn < 0) {
      return '∞';
    }

    return (Number(usdcAmount) / dailyReturn).toFixed(0);
  }, [activeTier.monthlyFeeUsd, monthlyRewardUsdc, usdcAmount]);

  const [mintingTx, setMintingTx] = useState('');
  const [minted, setMinted] = useState(false);
  const ldRef = useRef(null);

  function mintNft() {
    setMintingTx('0x0');
    setTimeout(() => {
      setMinted(true);
    }, 2000);
  }

  function signApiKey() {
    if (library && account) {
      library.getSigner(account).signMessage('test');
    }
  }

  return (
    <Container maxW="full" py="20" minH="90vh">
      <Box>
        <Text
          my="2"
          mb="8"
          fontSize={{ sm: '2xl', md: '4xl' }}
          textAlign="center"
          fontWeight={300}
          lineHeight={1.2}
        >
          Provide Funds and Earn Staking Rewards to
          <br />
          Maintain your Access <strong>Forever</strong>
        </Text>
      </Box>

      <Container maxW="container.lg">
        <HStack spacing="0" align="flex-end">
          <Box>
            <Text>Amount to be staked</Text>
            <Flex
              bg="white"
              shadow="md"
              px="4"
              py="4"
              roundedLeft="md"
              align="center"
            >
              <Input
                flex="1"
                variant="unstyled"
                rounded="none"
                fontSize="lg"
                value={usdcAmount}
                onChange={(e) => {
                  setUsdcAmount(e.target.value);
                  const parsedUsdcAmount = tryParseAmount(e.target.value, usdc);
                  if (parsedUsdcAmount && usdcPrice) {
                    setCmkAmount(
                      usdcPrice
                        .invert()
                        .quote(parsedUsdcAmount)
                        .toSignificant(6),
                    );
                  } else {
                    setCmkAmount('0');
                  }
                }}
              />
              <Text fontSize="sm" userSelect="none" color="gray.300">
                USDC
              </Text>
            </Flex>
          </Box>
          <Box>
            <Text>Value in CMK</Text>
            <Flex bg="white" shadow="md" px="4" py="4" align="center">
              <Input
                flex="1"
                variant="unstyled"
                rounded="none"
                fontSize="lg"
                value={cmkAmount}
                onChange={(e) => {
                  setCmkAmount(e.target.value);
                  const parsedCmkAmount = tryParseAmount(e.target.value, cmk);
                  if (parsedCmkAmount && usdcPrice) {
                    setUsdcAmount(
                      usdcPrice.quote(parsedCmkAmount).toSignificant(6),
                    );
                  } else {
                    setUsdcAmount('0');
                  }
                }}
              />
              <Text fontSize="sm" userSelect="none" color="gray.300">
                CMK
              </Text>
            </Flex>
          </Box>
          <Box>
            <Text>Token</Text>
            <Flex
              bg="white"
              shadow="md"
              px="4"
              py="15.5px"
              align="center"
              roundedRight="md"
            >
              <CmkLogoIcon color="purple.500" fontSize="28px" />
              <Text userSelect="none" mx="3">
                CMK
              </Text>
            </Flex>
          </Box>
          <Box flex="1" pl="8">
            <Button
              w="full"
              size="lg"
              py="30px"
              colorScheme="pink"
              isDisabled={!cmkAmount || !Number(cmkAmount)}
              onClick={mintNft}
            >
              Mint NFT
            </Button>
          </Box>
        </HStack>
      </Container>

      <Box
        maxW="container.xl"
        bg="white"
        shadow="md"
        mx="auto"
        mt="8"
        rounded="base"
      >
        <Flex h="96px">
          <Center
            w="320px"
            shadow="md"
            bg="gray.50"
            fontSize="lg"
            position="relative"
            cursor="pointer"
            _hover={{
              shadow: 'lg',
            }}
            onClick={() => {
              setShowTierSelection(!showTierSelection);
            }}
          >
            {activeTierKey} <Icon as={MdUnfoldMore} ml="2" />
            <Box position="absolute" top="0" left="0" right="0" zIndex="10">
              <Collapse
                in={showTierSelection}
                endingHeight={96 * 3}
                animateOpacity={false}
              >
                <Box ref={tierSelectorRef} shadow="md" bg="white">
                  {TIERS.map((tier) => (
                    <Center
                      key={tier.label}
                      h="96px"
                      _hover={{
                        bg: 'gray.50',
                      }}
                      fontSize="lg"
                      position="relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTierKey(tier.label);
                        setShowTierSelection(false);
                      }}
                      transitionDuration="normal"
                      transitionProperty="common"
                      px="4"
                    >
                      <Text
                        flex="1"
                        fontWeight={
                          activeTierKey === tier.label ? 'bold' : undefined
                        }
                      >
                        {tier.label}
                      </Text>
                      <HStack color="gray.400" fontSize="sm" spacing="1">
                        <Text>{tier.rewardMultiplier}x</Text>
                        <Text>
                          {tier.monthlyFeeUsd
                            ? `$${tier.monthlyFeeUsd}`
                            : 'Free'}
                        </Text>
                        <Icon
                          as={tier.lockupPeriod ? MdLock : MdLockOpen}
                          fontSize="1rem"
                        />
                        {tier.modelFramework && (
                          <Icon as={MdCode} fontSize="1rem" />
                        )}
                        {tier.terminalAccess && (
                          <CmkTerminalIcon fontSize="1rem" />
                        )}
                        {tier.apiGatewayAccess && (
                          <Icon as={MdApi} fontSize="1rem" />
                        )}
                        {tier.custom && (
                          <Icon as={MdAutoAwesome} fontSize="1rem" />
                        )}
                      </HStack>
                    </Center>
                  ))}
                </Box>
              </Collapse>
            </Box>
          </Center>
          <Flex flex="1" shadow="md">
            <VStack
              flex="1"
              textAlign="center"
              borderRight="2px"
              borderColor="gray.50"
            >
              <Text color="gray.600" py="2" fontSize="sm">
                Monthly Cost
              </Text>
              <Text flex="1" fontSize="2xl">
                {activeTier.monthlyFeeUsd
                  ? `$${activeTier.monthlyFeeUsd}`
                  : 'FREE'}
              </Text>
            </VStack>
            <VStack
              flex="1"
              textAlign="center"
              borderRight="2px"
              borderColor="gray.50"
            >
              <Text color="gray.600" py="2" fontSize="sm">
                {activeTier.rewardMultiplier}x Staking APY
              </Text>
              <Text flex="1" fontSize="2xl">
                {stakingApy.toString()}%
              </Text>
            </VStack>
            <VStack
              flex="1"
              textAlign="center"
              borderRight="2px"
              borderColor="gray.50"
            >
              <Text color="gray.600" py="2" fontSize="sm">
                Est. Days Access
              </Text>
              <Text flex="1" fontSize="2xl">
                {daysAccess} days
              </Text>
            </VStack>
            <VStack
              flex="1"
              textAlign="center"
              borderRight="2px"
              borderColor="gray.50"
            >
              <Text color="gray.600" py="2" fontSize="sm">
                Est. Monthly Reward
              </Text>
              <Text flex="1" fontSize="2xl">
                ${monthlyRewardUsdc}
              </Text>
            </VStack>
            <VStack
              flex="1"
              textAlign="center"
              borderRight="2px"
              borderColor="gray.50"
            >
              <Text color="gray.600" py="2" fontSize="sm">
                Est. Net Monthly Return
              </Text>
              <Text flex="1" fontSize="2xl">
                {Number(monthlyRewardUsdc) > activeTier.monthlyFeeUsd
                  ? `$${Number(monthlyRewardUsdc) - activeTier.monthlyFeeUsd}`
                  : `-$${activeTier.monthlyFeeUsd - Number(monthlyRewardUsdc)}`}
              </Text>
            </VStack>
            <VStack
              flex="1"
              textAlign="center"
              borderRight="2px"
              borderColor="gray.50"
            >
              <Text color="gray.600" py="2" fontSize="sm">
                Net APY
              </Text>
              <Text flex="1" fontSize="2xl">
                {Number(usdcAmount)
                  ? (
                      ((Number(monthlyRewardUsdc) - activeTier.monthlyFeeUsd) /
                        Number(usdcAmount)) *
                      100
                    ).toFixed(2)
                  : '0'}
                %
              </Text>
            </VStack>
          </Flex>
        </Flex>
        <Flex h="480px">
          <VStack w="320px" shadow="md" py="8">
            <VStack flex="1" px="6" align="stretch" spacing="6">
              <HStack spacing="4">
                <Icon as={MdTrendingUp} fontSize="2xl" color="purple.500" />
                <Text>{activeTier.rewardMultiplier}x Staking Rewards</Text>
              </HStack>
              <HStack spacing="4">
                <Icon
                  as={activeTier.lockupPeriod ? MdLock : MdLockOpen}
                  fontSize="2xl"
                  color="purple.500"
                />
                <Text>{activeTier.lockupPeriod || 'No'} Lockup Period</Text>
              </HStack>
              <HStack
                spacing="4"
                opacity={!activeTier.modelFramework ? 0.4 : undefined}
              >
                <Icon
                  as={MdCode}
                  fontSize="2xl"
                  color={activeTier.modelFramework ? 'purple.500' : undefined}
                />
                <Text>Model Framework</Text>
              </HStack>
              <HStack
                spacing="4"
                opacity={!activeTier.terminalAccess ? 0.4 : undefined}
              >
                <CmkTerminalIcon
                  fontSize="2xl"
                  color={activeTier.terminalAccess ? 'purple.500' : undefined}
                />
                <Text>Credmark Terminal Access</Text>
              </HStack>
              <HStack
                spacing="4"
                opacity={!activeTier.apiGatewayAccess ? 0.4 : undefined}
              >
                <Icon
                  as={MdApi}
                  fontSize="2xl"
                  color={activeTier.apiGatewayAccess ? 'purple.500' : undefined}
                />
                <Text>
                  {activeTier.apiGatewayAccess || 'API Gateway Access'}
                </Text>
              </HStack>
              <HStack
                spacing="4"
                opacity={!activeTier.custom ? 0.4 : undefined}
              >
                <Icon
                  as={MdAutoAwesome}
                  fontSize="2xl"
                  color={activeTier.custom ? 'purple.500' : undefined}
                />
                <Text>Custom Models &amp; Reports</Text>
              </HStack>
            </VStack>
            <Box>
              <NextLink href="/api-access/tiers" passHref>
                <Link>
                  <Button
                    leftIcon={<Icon as={MdArrowBack} />}
                    variant="link"
                    colorScheme="gray"
                  >
                    Back to Tier Comparison
                  </Button>
                </Link>
              </NextLink>
            </Box>
          </VStack>
          <Box flex="1" shadow="md" position="relative">
            <MintChart
              activeTier={activeTier}
              rewardCmkPerSecond={rewardCmkPerSecond}
              totalCmkShares={totalCmkShares}
              selectedAmount={Number(usdcAmount)}
            />
            <Box
              position="absolute"
              bottom="56px"
              right="50px"
              w="40%"
              minW="360px"
              p="8"
              shadow="2xl"
              bg="white"
              fontSize="lg"
            >
              <Text>
                If your monthly staking rewards exceeds the monthly cost for the
                API, your access is valid <strong>FOREVER</strong>.
              </Text>
              <Button
                mt="4"
                size="lg"
                rightIcon={<Icon as={MdArrowForward} />}
                variant="link"
                color="gray.800"
                fontWeight={300}
                onClick={faq.onToggle}
              >
                *More Info available in our FAQ
              </Button>
            </Box>
          </Box>
        </Flex>
      </Box>
      <FaqModal {...faq} />
      <AlertDialog
        isOpen={!!mintingTx}
        onClose={() => ({})}
        leastDestructiveRef={ldRef}
        isCentered
        size="xs"
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogBody p="8" textAlign="center">
            <Text fontSize="3xl" fontWeight={300}>
              {minted ? 'Minting Successful' : 'Minting NFT'}
            </Text>
            <Button
              colorScheme="gray"
              variant="outline"
              mt="4"
              w="100%"
              leftIcon={<EtherscanLogoIcon />}
              size="lg"
            >
              View on Etherscan
            </Button>

            {minted && (
              <Text mt="4" fontSize="xs" textAlign="left">
                Your signature is required to complete the process
              </Text>
            )}
            {minted && (
              <Button
                colorScheme="pink"
                w="100%"
                size="lg"
                mt="1"
                onClick={signApiKey}
              >
                Sign API Key
              </Button>
            )}
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  );
}
