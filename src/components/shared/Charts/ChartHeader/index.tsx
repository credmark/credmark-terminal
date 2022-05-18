import { HStack, Icon, Img, Spacer, Text, Flex } from '@chakra-ui/react';
import React from 'react';
import { CSVLink } from 'react-csv';
import {
  MdOutlineFileDownload,
  MdFullscreenExit,
  MdFullscreen,
} from 'react-icons/md';

export interface ChartHeaderProps {
  logo?: string;
  title?: string;
  toggleFullScreen?: () => void;
  isFullScreen?: boolean;
  downloadFileName?: string;
  downloadFileHeaders?: string[];
  downloadData?: string;
  borderColor?: string;
  textColor?: string;
  backgroundColor?: string;
}
const ChartHeader = ({
  logo,
  title,
  toggleFullScreen,
  downloadData,
  downloadFileName,
  downloadFileHeaders,
  isFullScreen,
  borderColor,
  backgroundColor,
  textColor,
}: ChartHeaderProps) => {
  return (
    <HStack
      minH="30px"
      borderRadius="4px 4px 0px 0px"
      px="4"
      py="2"
      roundedTop="md"
      borderBottom="2px"
      backgroundColor={backgroundColor || 'white'}
      borderColor={borderColor || '#DEDEDE'}
    >
      <Img src={logo} height="20px" />
      <Text margin={0} color={textColor || 'gray.900'} fontSize="14px">
        {title}{' '}
      </Text>
      <Spacer />

      <Flex zIndex={99} alignItems="center" gap="16px">
        {downloadData && downloadData?.length > 0 ? (
          <CSVLink
            filename={downloadFileName}
            headers={downloadFileHeaders}
            data={downloadData}
            style={{ display: 'flex' }}
          >
            <Icon
              width="15px"
              height="15px"
              cursor="pointer"
              marginInlineStart={0}
              as={MdOutlineFileDownload}
              color={textColor || 'gray.900'}
            />
          </CSVLink>
        ) : (
          <Icon
            width="15px"
            height="15px"
            cursor="pointer"
            marginInlineStart="0 !important"
            as={MdOutlineFileDownload}
            color={textColor || 'gray.900'}
          />
        )}

        <Icon
          cursor="pointer"
          onClick={toggleFullScreen}
          as={isFullScreen ? MdFullscreenExit : MdFullscreen}
          width="15px"
          height="15px"
          marginInlineStart="0 !important"
          color={textColor || 'gray.900'}
        />
      </Flex>
    </HStack>
  );
};

export default ChartHeader;