import { Img } from '@chakra-ui/image';
import { Container, Divider, HStack, Text } from '@chakra-ui/layout';
import React from 'react';

import { CMK } from '~/constants/tokens';
import { useSCmkBalance } from '~/hooks/stats';
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

  return (
    <Container
      mt="6"
      maxW="lg"
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
                : '??'}
            </strong>{' '}
            CMK
          </Text>
        </HStack>
        <Divider orientation="vertical" h="50px" />
        <HStack flex="1" justify="center">
          <Img src="/img/scmk.png" h="8" />
          <Text color="purple.500" lineHeight="10">
            <strong>
              {sCmkBalance.loading || !sCmkBalance.value
                ? '??'
                : formatTokenAmount(sCmkBalance.value, 2, { shorten: true })}
            </strong>{' '}
            Staked CMK
          </Text>
        </HStack>
      </HStack>
    </Container>
  );
}
