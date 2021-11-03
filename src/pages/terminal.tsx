import { Img } from '@chakra-ui/image';
import { Text, Container, VStack, Box, Flex, HStack } from '@chakra-ui/layout';
import { Collapse } from '@chakra-ui/transition';
import React, { useState } from 'react';

import LineChart from '~/components/Charts/LineChart';
import Navbar from '~/components/Navbar';

const ASSETS = [
  { label: 'AAVE', value: 'aave', color: '#B0539F' },
  { label: 'COMPOUND', value: 'compound', color: '#00D395' },
  { label: 'USDC', value: 'usdc', color: '#2775CA' },
];

type ChartData = Array<{
  timestamp: Date;
  value: number;
}>;

function dummyData(days: number): ChartData {
  const oneHour = 3600 * 1000;
  const oneDay = 24 * oneHour;
  let base = Date.now() - (days + 1) * oneDay;
  const date: Date[] = [];
  const data: number[] = [Math.random() * 300];
  let min: number = data[0];

  for (let i = 1; i < days * 24; i++) {
    const now = new Date((base += oneHour));
    const value = Math.round((Math.random() - 0.5) * 20 + data[i - 1]);
    date.push(now);
    data.push(Number(value.toFixed(0)));
    if (value < min) {
      min = value;
    }
  }

  const offset = min < 0 ? 0 - min : 0;

  const chartData: ChartData = [];
  for (let i = 0; i < days * 24; i++) {
    chartData.push({
      timestamp: date[i],
      value: data[i] + offset,
    });
  }

  return chartData;
}

export default function TerminalPage() {
  const [activeAssets, setActiveAssets] = useState([
    'aave',
    'compound',
    'usdc',
  ]);

  const [activeGraphs, setActiveGraphs] = useState(['var', 'lcr']);
  const [lcrDuration, setLcrDuration] = useState(7); // In Days

  const [dd1] = useState(dummyData(30));
  const [dd2] = useState(dummyData(30));
  const [dd3] = useState(dummyData(30));

  const dd: Record<string, ChartData> = {
    aave: dd1,
    compound: dd2,
    usdc: dd3,
  };

  return (
    <VStack
      minH="100vh"
      bg="linear-gradient(135deg, #DE1A600C 0%, #3B00650C 50%, #08538C0C 100%)"
      spacing="8"
      pb="20"
    >
      <Navbar />
      <Box></Box>
      <Container maxW="container.xl" p="8" bg="white" shadow="lg" rounded="3xl">
        <VStack align="stretch" mt="-56px">
          <Box
            alignSelf="center"
            px="6"
            pt="2"
            pb="1"
            bg="white"
            shadow="lg"
            rounded="lg"
            mb="8"
          >
            <Text
              fontFamily="Credmark Regular"
              textAlign="center"
              bgGradient="linear(135deg, #CC1662, #3B0066)"
              bgClip="text"
              lineHeight="1.2"
              fontSize="3xl"
            >
              TERMINAL DATA
            </Text>
          </Box>

          <Container
            maxW="container.md"
            alignSelf="center"
            fontFamily="Credmark Regular"
          >
            <Flex align="center">
              <Text color="gray.600" lineHeight="1">
                TOGGLE
                <br />
                ASSETS
              </Text>
              <HStack
                cursor="pointer"
                _hover={{
                  shadow: 'xl',
                }}
                ml="8"
                color="#B0539F"
                bg="#B0539F20"
                px="4"
                h="10"
                rounded="md"
                border={activeAssets.includes('aave') ? '2px' : '1px'}
                borderColor="#B0539F"
                transitionProperty="box-shadow"
                transitionDuration="normal"
                opacity={activeAssets.includes('aave') ? 1.0 : 0.5}
                onClick={() =>
                  activeAssets.includes('aave')
                    ? setActiveAssets(
                        activeAssets.filter((aa) => aa !== 'aave'),
                      )
                    : setActiveAssets([...activeAssets, 'aave'])
                }
              >
                <Img src="/img/assets/aave.png" w="6" />
                <Text>AAVE</Text>
              </HStack>
              <HStack
                cursor="pointer"
                _hover={{
                  shadow: 'xl',
                }}
                ml="4"
                color="#00D395"
                bg="#00D39520"
                px="4"
                h="10"
                rounded="md"
                border={activeAssets.includes('compound') ? '2px' : '1px'}
                borderColor="#00D395"
                transitionProperty="box-shadow"
                transitionDuration="normal"
                opacity={activeAssets.includes('compound') ? 1.0 : 0.5}
                onClick={() =>
                  activeAssets.includes('compound')
                    ? setActiveAssets(
                        activeAssets.filter((aa) => aa !== 'compound'),
                      )
                    : setActiveAssets([...activeAssets, 'compound'])
                }
              >
                <Img src="/img/assets/compound.png" w="6" />
                <Text>COMPOUND</Text>
              </HStack>
              <HStack
                cursor="pointer"
                _hover={{
                  shadow: 'xl',
                }}
                ml="4"
                color="#2775CA"
                bg="#2775CA20"
                px="4"
                h="10"
                rounded="md"
                border={activeAssets.includes('usdc') ? '2px' : '1px'}
                borderColor="#2775CA"
                transitionProperty="box-shadow"
                transitionDuration="normal"
                opacity={activeAssets.includes('usdc') ? 1.0 : 0.5}
                onClick={() =>
                  activeAssets.includes('usdc')
                    ? setActiveAssets(
                        activeAssets.filter((aa) => aa !== 'usdc'),
                      )
                    : setActiveAssets([...activeAssets, 'usdc'])
                }
              >
                <Img src="/img/assets/usdc.png" w="6" />
                <Text>USDC</Text>
              </HStack>
            </Flex>
            <Flex align="center" mt="4">
              <Text color="gray.600" lineHeight="1">
                TOGGLE
                <br />
                GRAPHS
              </Text>
              <VStack
                cursor="pointer"
                _hover={{
                  shadow: 'xl',
                }}
                ml="8"
                color="gray.700"
                bg="gray.50"
                px="4"
                h="10"
                rounded="md"
                border={activeGraphs.includes('var') ? '2px' : '1px'}
                borderColor="#gray.700"
                transitionProperty="box-shadow"
                transitionDuration="normal"
                opacity={activeGraphs.includes('var') ? 1.0 : 0.5}
                onClick={() =>
                  activeGraphs.includes('var')
                    ? setActiveGraphs(activeGraphs.filter((aa) => aa !== 'var'))
                    : setActiveGraphs([...activeGraphs, 'var'])
                }
                spacing="0"
                justify="center"
              >
                <Text lineHeight="1">VAR</Text>
                <Text fontSize="xs" lineHeight="1">
                  Value at risk
                </Text>
              </VStack>
              <VStack
                cursor="pointer"
                _hover={{
                  shadow: 'xl',
                }}
                ml="4"
                color="gray.700"
                bg="gray.50"
                px="4"
                h="10"
                rounded="md"
                border={activeGraphs.includes('lcr') ? '2px' : '1px'}
                borderColor="#gray.700"
                transitionProperty="box-shadow"
                transitionDuration="normal"
                opacity={activeGraphs.includes('lcr') ? 1.0 : 0.5}
                onClick={() =>
                  activeGraphs.includes('lcr')
                    ? setActiveGraphs(activeGraphs.filter((aa) => aa !== 'lcr'))
                    : setActiveGraphs([...activeGraphs, 'lcr'])
                }
                spacing="0"
                justify="center"
              >
                <Text lineHeight="1">LCR</Text>
                <Text fontSize="xs" lineHeight="1">
                  Liquidity Coverage Ratio
                </Text>
              </VStack>
            </Flex>
          </Container>

          <Collapse in={activeGraphs.includes('var')}>
            <Box
              position="relative"
              mx="auto"
              mt="12"
              pt="2"
              pb="1"
              bg="white"
              shadow="lg"
              rounded="lg"
              w="400px"
              zIndex="2"
            >
              <Text
                fontFamily="Credmark Regular"
                textAlign="center"
                lineHeight="1.2"
                fontSize="xl"
                color="purple.500"
              >
                VAR (VALUE AT RISK)
              </Text>
            </Box>
            <Box
              position="relative"
              bg="gray.50"
              py="8"
              mt="-4"
              zIndex="1"
              rounded="md"
            >
              <Flex justify="center">
                {activeAssets.map((aa) => {
                  const asset = ASSETS.find((a) => a.value === aa);
                  if (!asset) throw new Error('Invalid asset');
                  return (
                    <VStack
                      key={asset.value}
                      color={asset.color}
                      spacing="0"
                      m="4"
                      px="6"
                      py="2"
                      shadow="md"
                      bg="white"
                      rounded="lg"
                    >
                      <Text fontFamily="Credmark Regular">{asset.label}</Text>
                      <Text fontSize="2xl" fontWeight="bold">
                        12.34
                      </Text>
                      <Text fontSize="xs">+4.56%</Text>
                    </VStack>
                  );
                })}
              </Flex>
            </Box>
          </Collapse>

          <Collapse in={activeGraphs.includes('lcr')}>
            <Box
              position="relative"
              mx="auto"
              mt="12"
              pt="2"
              pb="1"
              bg="white"
              shadow="lg"
              rounded="lg"
              w="400px"
              zIndex="2"
            >
              <Text
                fontFamily="Credmark Regular"
                textAlign="center"
                lineHeight="1.2"
                fontSize="xl"
                color="purple.500"
              >
                LCR (LIQUIDITY COVERAGE RATIO)
              </Text>
            </Box>
            <Box
              position="relative"
              bg="gray.50"
              py="8"
              mt="-4"
              zIndex="1"
              rounded="md"
            >
              <LineChart
                lines={activeAssets.map((aa) => {
                  const asset = ASSETS.find((a) => a.value === aa);
                  if (!asset) throw new Error('Invalid asset');
                  return {
                    name: asset.label,
                    color: asset.color,
                    data: dd[asset.value]?.slice((30 - lcrDuration) * 24),
                  };
                })}
              />
              <Flex pl="20">
                {[7, 14, 21, 30].map((days) => (
                  <Box
                    key={days}
                    p="2"
                    mx="2"
                    fontWeight="bold"
                    color={lcrDuration === days ? 'gray.900' : 'gray.300'}
                    cursor="pointer"
                    borderBottom={lcrDuration === days ? '2px' : '0'}
                    borderColor="gray.700"
                    onClick={() => setLcrDuration(days)}
                    _hover={
                      lcrDuration === days
                        ? {}
                        : {
                            color: 'gray.700',
                          }
                    }
                  >
                    {days}D
                  </Box>
                ))}
              </Flex>
            </Box>
          </Collapse>
        </VStack>
      </Container>
    </VStack>
  );
}
