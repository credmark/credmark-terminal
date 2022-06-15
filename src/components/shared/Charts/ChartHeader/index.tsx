import {
  HStack,
  Icon,
  Spacer,
  Text,
  Flex,
  Img,
  Tag,
  Link,
  IconProps,
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
  toggleExpand?: () => void;
  isExpanded?: boolean;
  downloadCsv?: {
    filename: string;
    headers: string[];
    data: string | Record<string, unknown>[];
  };
  tooltip?: {
    content: React.ReactNode;
    status?: 'info' | 'error';
    iconProps?: IconProps;
  };
  info?: React.ReactNode;
  externalLink?: string;
}

const ChartHeader = ({
  logo,
  title,
  subtitle,
  toggleExpand,
  isExpanded,
  downloadCsv,
  tooltip,
  externalLink,
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
      <Text color="gray.900" fontSize="14px">
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
          iconProps={{
            color: 'gray.300',
            boxSize: 5,
            ...(tooltip.iconProps ?? {}),
          }}
        >
          {tooltip.content}
        </StatusPopover>
      )}
      {externalLink && (
        <Link href={externalLink} isExternal display="flex" alignItems="center">
          <Icon color="gray.300" as={OpenInNewIcon} boxSize={4} />
        </Link>
      )}

      <Spacer />

      <Flex zIndex={99} alignItems="center" gap="16px">
        {downloadCsv && (
          <CSVLink
            filename={downloadCsv.filename}
            headers={downloadCsv.headers}
            data={downloadCsv.data}
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
        )}

        {toggleExpand && (
          <Icon
            cursor="pointer"
            onClick={toggleExpand}
            as={isExpanded ? FullscreenExitIcon : FullscreenIcon}
            width="15px"
            height="15px"
            marginInlineStart="0 !important"
            color="gray.900"
          />
        )}
      </Flex>
    </HStack>
  );
};

export default ChartHeader;
