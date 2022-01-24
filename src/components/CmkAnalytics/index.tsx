import { Box, HStack, Img, Stack, Text, VStack, Wrap } from '@chakra-ui/react';
import Color from 'color';
import React, { useEffect, useRef, useState } from 'react';

import { useOnScreen } from '~/hooks/useOnScreen';
import { useActiveWeb3React } from '~/hooks/web3';

import CmkTokenStats from './CmkTokenStats';
import StakingStats from './StakingStats';

type AssetKey = 'CMK' | 'XCMK';

export const ASSETS = [
  {
    key: 'CMK' as AssetKey,
    title: 'CMK Token Stats',
    logo: '/img/cmk.svg',
    color: Color('#3B0065'),
    scrollToId: 'cmk-analytics-container',
  },
  {
    key: 'XCMK' as AssetKey,
    title: 'Staking Stats',
    logo: '/img/xcmk.svg',
    color: Color('#DE1A60'),
    scrollToId: 'xcmk-analytics-container',
  },
];

export default function CmkAnalytics() {
  const { account } = useActiveWeb3React();

  const [activeAsset, setActiveAsset] = useState<AssetKey>();
  const ref1 = useRef(null);
  const ref2 = useRef(null);

  const onScreen1 = useOnScreen(ref1);
  const onScreen2 = useOnScreen(ref2);

  useEffect(() => {
    if (onScreen1) setActiveAsset('CMK');
  }, [onScreen1]);

  useEffect(() => {
    if (onScreen2) setActiveAsset('XCMK');
  }, [onScreen2]);

  return (
    <>
      <VStack align="stretch" mt="-56px" spacing="20">
        <HStack
          alignSelf="center"
          px="6"
          pt="2"
          pb="1"
          bg="white"
          shadow="lg"
          rounded="lg"
          mb="8"
          spacing="4"
        >
          <Img src="/img/cmk.svg" h="72px" mt="-20px" />
          <Text
            fontFamily="Credmark Regular"
            textAlign="center"
            bgGradient="linear(135deg, #08538C, #3B0065)"
            bgClip="text"
            lineHeight="1.2"
            fontSize="4xl"
            px="1"
          >
            Analytics
          </Text>
        </HStack>
        <Stack
          direction={{ base: 'column', md: 'row' }}
          mt="20"
          align="center"
          justify="center"
          position="sticky"
          top={!account ? '88px' : '164px'}
          bg="white"
          zIndex="2"
          py="2"
          roundedBottom="lg"
          borderBottom="1px"
          borderLeft="1px"
          borderRight="1px"
          borderColor="gray.50"
        >
          <Text
            color="gray.600"
            lineHeight="1"
            w={{ base: 'unset', md: '120px' }}
            fontFamily="Credmark Regular"
          >
            BROWSE METRICS
          </Text>
          <Wrap spacing="4">
            {ASSETS.map((asset) => (
              <HStack key={asset.key} spacing="1">
                <HStack
                  cursor="pointer"
                  _hover={{
                    shadow: 'xl',
                  }}
                  color={asset.color.toString()}
                  bg={asset.color.fade(0.875).toString()}
                  px="4"
                  h="10"
                  rounded="md"
                  border={activeAsset === asset.key ? '2px' : '1px'}
                  borderColor={asset.color.toString()}
                  transitionProperty="box-shadow"
                  transitionDuration="normal"
                  opacity={activeAsset === asset.key ? 1.0 : 0.5}
                  onClick={() => {
                    setActiveAsset(asset.key);
                    const scrollToElem = document.getElementById(
                      asset.scrollToId,
                    );
                    if (scrollToElem)
                      window.scrollTo({
                        top: scrollToElem.offsetTop,
                        behavior: 'smooth',
                      });
                  }}
                  whiteSpace="nowrap"
                >
                  <Box w="6">
                    <Img src={asset.logo} />
                  </Box>
                  <Text fontFamily="Credmark Regular">{asset.title}</Text>
                </HStack>
              </HStack>
            ))}
          </Wrap>
        </Stack>
        <Box id="cmk-analytics-container" ref={ref1}>
          <CmkTokenStats />
        </Box>

        <Box id="xcmk-analytics-container" ref={ref2}>
          <StakingStats />
        </Box>
      </VStack>
    </>
  );
}
