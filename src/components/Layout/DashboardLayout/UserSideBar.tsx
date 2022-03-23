import { Flex, Img, Stack, Text, Box } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

import { adminRoutes } from '~/constants/adminRoutes';

import SidebarMenu from './SidebarMenu';
interface UserSideBarProps {
  onClose?: () => void;
  isDrawer?: boolean;
}
const UserSideBar: FC<UserSideBarProps> = ({ onClose, isDrawer = false }) => {
  const router = useRouter();

  return (
    <Stack
      boxShadow={isDrawer ? 'none' : 'xl'}
      pb="4"
      overflowY="scroll"
      height="100%"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'pink',
          borderRadius: '24px',
        },
      }}
    >
      <Box py="6">
        {/* <Image src={logo} alt="logoImage" height={40} width={200} /> */}
      </Box>
      <>
        {' '}
        {adminRoutes.map((item, i) => {
          if (item.more !== undefined) {
            return (
              <SidebarMenu
                more={item.more}
                icon={item.icon}
                text={item.text}
                key={i}
                onClose={onClose ? onClose : undefined}
              />
            );
          } else {
            return (
              <Link href={`${item.link}`} key={i} passHref>
                <Flex
                  alignItems="center"
                  style={{ padding: '15px 20px' }}
                  _hover={{
                    bg: 'pink.500',
                    color: 'white',
                  }}
                  bg={router.asPath === item.link ? 'pink.500' : 'white'}
                  borderRight={
                    router.asPath === item.link
                      ? '5px solid red !important'
                      : ''
                  }
                  color={router.asPath === item.link ? 'white' : 'black'}
                  onClick={onClose}
                >
                  <Img src={item.icon} />
                  <Text
                    fontSize="sm"
                    fontWeight={router.asPath === item.link ? 'bold' : ''}
                    as="span"
                    pl="1.5"
                  >
                    {item.text}
                  </Text>
                </Flex>
              </Link>
            );
          }
        })}
      </>
    </Stack>
  );
};

export default UserSideBar;
