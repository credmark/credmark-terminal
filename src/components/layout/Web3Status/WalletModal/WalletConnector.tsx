import React from 'react';

import { Connector, WalletInfo } from '~/constants/wallet';

import Option from './Option';

export default function WalletConnector({
  wallet,
  onClick,
}: {
  wallet: WalletInfo;
  onClick: (connector: Connector) => void;
}) {
  const isActive = wallet.hooks.useIsActive();

  return (
    <Option
      onClick={() => onClick(wallet.connector)}
      id={`connect-${wallet.name}`}
      active={isActive}
      color={wallet.color}
      link={wallet.href}
      header={wallet.name}
      subheader={null}
      icon={wallet.iconURL}
    />
  );
}
