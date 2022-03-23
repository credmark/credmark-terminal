import { Box, Flex, Icon, Text, Img, HStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { IoChevronDown, IoChevronForward } from 'react-icons/io5';

interface SidebarMenuProps {
  icon: string;
  text: string;
  more: {
    icon: string;
    text: string;
    link: string;
  }[];
  onClose?: () => void;
}

const SidebarMenu: FC<SidebarMenuProps> = ({ icon, text, more, onClose }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropDown = () => setIsOpen((prev) => !prev);

  return (
    <>
      <Flex
        alignItems="center"
        style={{ padding: '15px 20px' }}
        justify="space-between"
        _hover={{
          bg: 'pink.500',
          color: 'white',
          py: 2,
        }}
        onClick={toggleDropDown}
        cursor="pointer"
      >
        <Box>
          <HStack>
            <Img src={icon} />
            <Text fontSize="sm" as="span">
              {text}
            </Text>
          </HStack>
        </Box>
        {isOpen ? (
          <Icon fontSize="xl" mr="2">
            <IoChevronDown />
          </Icon>
        ) : (
          <Icon fontSize="xl" mr="2">
            <IoChevronForward />
          </Icon>
        )}
      </Flex>
      {isOpen &&
        more.map((moreLinks, i) => (
          <Link href={`${moreLinks.link}`} key={i} passHref>
            <Flex
              alignItems="center"
              style={{ padding: '15px 25px' }}
              _hover={{
                bg: 'pink.500',
                color: 'white',
              }}
              bg={router.asPath === moreLinks.link ? 'pink.500' : 'white'}
              color={router.asPath === moreLinks.link ? 'white' : 'black'}
              onClick={onClose}
            >
              <Img src={moreLinks.icon} />

              <Text fontSize="sm" as="span" pl="1.5">
                {moreLinks.text}
              </Text>
            </Flex>
          </Link>
        ))}
    </>
  );
};

export default SidebarMenu;
