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
import React from 'react';
import { CSVLink } from 'react-csv';
import {
  BsDownload,
  BsFullscreen,
  BsFullscreenExit,
  BsBoxArrowUpRight,
} from 'react-icons/bs';

import StatusPopover from '~/components/shared/StatusPopover';

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
    <HStack minH="30px" roundedTop="md" px="4" py="2">
      {logo && typeof logo === 'string' && <Img src={logo} alt={title} h="5" />}
      {logo && typeof logo !== 'string' && <>{logo}</>}
      <Text fontSize="md" fontWeight={400}>
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
          <Icon color="gray.300" as={BsBoxArrowUpRight} boxSize={4} />
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
            <Icon cursor="pointer" as={BsDownload} boxSize="4" />
          </CSVLink>
        )}

        {toggleExpand && (
          <Icon
            cursor="pointer"
            boxSize="4"
            onClick={toggleExpand}
            as={isExpanded ? BsFullscreenExit : BsFullscreen}
          />
        )}
      </Flex>
    </HStack>
  );
};

export default ChartHeader;
