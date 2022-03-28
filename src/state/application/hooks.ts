import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useActiveWeb3React } from '~/hooks/web3';

import { AppDispatch, AppState } from '../index';

import {
  ApplicationModal,
  setOpenModal,
  setSidebarVisibility,
} from './actions';

export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React();

  return useSelector(
    (state: AppState) => state.application.blockNumber[chainId ?? -1],
  );
}

export function useModalOpen(modal: ApplicationModal): boolean {
  const openModal = useSelector(
    (state: AppState) => state.application.openModal,
  );
  return openModal === modal;
}

export function useToggleModal(modal: ApplicationModal): () => void {
  const open = useModalOpen(modal);
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(
    () => dispatch(setOpenModal(open ? null : modal)),
    [dispatch, modal, open],
  );
}

export function useWalletModalToggle(): () => void {
  return useToggleModal(ApplicationModal.WALLET);
}

export function useSidebarVisibility() {
  return useSelector((state: AppState) => state.application.sidebarVisibility);
}

export function useShowSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setSidebarVisibility(true)), [dispatch]);
}

export function useHideSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  return useCallback(() => dispatch(setSidebarVisibility(false)), [dispatch]);
}
