import {
  HStack,
  Icon,
  Spacer,
  Text,
  Flex,
  Img,
  Tag,
  Link,
} from '@chakra-ui/react';
import FileDownloadIcon from '@mui/icons-material/FileDownloadOutlined';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import React from 'react';
import { CSVLink } from 'react-csv';

import StatusPopover from '../../StatusPopover';

export interface ChartHeaderProps {
  logo?: string | React.ReactNode;
  title?: string;
  subtitle?: string;
  toggleFullScreen?: () => void;
  isFullScreen?: boolean;
  downloadFileName?: string;
  downloadFileHeaders?: string[];
  // TODO: this data object seems to be abit mixed up in structure,
  // I will need to identify it and type it properly, so disabling rule for now
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  downloadData?: any;
  tooltip?: React.ReactNode;
  openInNewTab?: string;
}
const ChartHeader = ({
  logo,
  title,
  subtitle,
  toggleFullScreen,
  downloadData,
  downloadFileName,
  downloadFileHeaders,
  isFullScreen,
  tooltip,
  openInNewTab,
}: ChartHeaderProps) => {
  return (
    <HStack
      minH="30px"
      roundedTop="md"
      px="4"
      py="2"
      borderBottom="2px"
      borderColor="#DEDEDE"
      bg="white"
    >
      {logo && typeof logo === 'string' && <Img src={logo} alt={title} h="5" />}
      {logo && typeof logo !== 'string' && <>{logo}</>}
      <Text margin={0} color="gray.900" fontSize="14px">
        {title}
      </Text>
      {subtitle && (
        <Tag colorScheme="gray" size="sm">
          {subtitle}
        </Tag>
      )}
      {tooltip && (
        <StatusPopover
          status="info"
          iconProps={{ color: 'gray.300', boxSize: 5 }}
        >
          {tooltip}
        </StatusPopover>
      )}
      {openInNewTab && (
        <Link href={openInNewTab} isExternal display="flex" alignItems="center">
          <Icon color="gray.300" as={OpenInNewIcon} boxSize={4} />
        </Link>
      )}
      <Spacer />

      <Flex zIndex={99} alignItems="center" gap="16px">
        {downloadData && downloadData?.length > 0 ? (
          <CSVLink
            filename={downloadFileName}
            headers={downloadFileHeaders}
            data={downloadData}
            style={{ display: 'flex' }}
            aria-label="Download"
          >
            <Icon
              width="15px"
              height="15px"
              cursor="pointer"
              marginInlineStart={0}
              as={FileDownloadIcon}
              color="gray.900"
            />
          </CSVLink>
        ) : (
          <Icon
            width="15px"
            height="15px"
            cursor="pointer"
            marginInlineStart="0 !important"
            as={FileDownloadIcon}
            color="gray.900"
          />
        )}

        <Icon
          cursor="pointer"
          onClick={toggleFullScreen}
          as={isFullScreen ? FullscreenExitIcon : FullscreenIcon}
          width="15px"
          height="15px"
          marginInlineStart="0 !important"
          color="gray.900"
        />
      </Flex>
    </HStack>
  );
};

export default ChartHeader;
