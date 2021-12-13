import { Img } from '@chakra-ui/image';
import { Box, Divider, HStack, Link, Text } from '@chakra-ui/layout';
import { Icon, Tooltip } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import React from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

import { CMK } from '~/constants/tokens';
import { useSCmkBalance, useSCmkToCmk } from '~/hooks/stats';
import { useActiveWeb3React } from '~/hooks/web3';
import { useTokenBalance } from '~/state/wallet/hooks';
import { formatTokenAmount } from '~/utils/formatTokenAmount';

export default function WalletStatus() {
  const { chainId, account } = useActiveWeb3React();

  const cmkBalance = useTokenBalance(
    account ?? undefined,
    chainId ? CMK[chainId] : undefined,
  );

  const sCmkBalance = useSCmkBalance(account);

  const sCmkToCmkBalance = useSCmkToCmk(
    BigNumber.from(sCmkBalance.value?.quotient?.toString() ?? '0'),
  );

  const sCmkToCmk = useSCmkToCmk(BigNumber.from('1000000000000000000')); // 1 xCMK

  return (
    <Box
      mt="6"
      bg="gray.50"
      rounded="xl"
      border="1px"
      borderColor="gray.100"
      px="2"
    >
      <HStack>
        <Text
          py="2"
          color="purple.500"
          textAlign="center"
          fontSize="9px"
          fontWeight="bold"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(-180deg)',
            textOrientation: 'mixed',
          }}
        >
          WALLET
        </Text>
        <HStack flex="1" justify="center">
          <Img src="/img/cmk.png" h="8" />
          <Text color="purple.500">
            <strong>
              {cmkBalance
                ? formatTokenAmount(cmkBalance, 2, { shorten: true })
                : '??'}{' '}
              CMK
            </strong>
          </Text>
          <Link
            href={`https://app.uniswap.org/#/swap?outputCurrency=${
              CMK[chainId ?? 1]?.address
            }`}
            isExternal
            color="purple.500"
          >
            <Icon as={FaExternalLinkAlt} />
          </Link>
        </HStack>
        <Divider orientation="vertical" h="50px" />
        <Tooltip
          placement="bottom-end"
          bg="purple.500"
          color="white"
          rounded="md"
          fontSize="sm"
          p="2"
          label={
            <Text>
              xCMK is your share of the rewards pool.
              <br /> Staking includes a flat APR plus Credmark revenue, issued
              every 8 hours
            </Text>
          }
        >
          <HStack flex="1" justify="center">
            <Img src="/img/xcmk.png" h="8" />
            <Text color="purple.500" lineHeight="1">
              <strong>
                {sCmkBalance.loading || !sCmkBalance.value
                  ? '??'
                  : formatTokenAmount(sCmkBalance.value, 2, {
                      shorten: true,
                    })}{' '}
                xCMK
              </strong>
              <br />
              <Text as="span" fontSize="xs">
                (
                {sCmkToCmkBalance.loading || !sCmkToCmkBalance.value
                  ? '??'
                  : formatTokenAmount(sCmkToCmkBalance.value, 2, {
                      shorten: true,
                    })}{' '}
                CMK)
              </Text>
            </Text>
          </HStack>
        </Tooltip>
        <Divider orientation="vertical" h="50px" />
        <HStack flex="1" justify="center">
          <Text textAlign="right" color="purple.500" fontWeight="700">
            1
          </Text>
          <Img src="/img/xcmk.png" h="6" />
          <Text>=</Text>
          <Text color="purple.500" fontWeight="700">
            {!sCmkToCmk.loading ? formatTokenAmount(sCmkToCmk.value, 2) : '??'}
          </Text>
          <Img src="/img/cmk.png" h="6" />
        </HStack>
      </HStack>
    </Box>
  );
}
