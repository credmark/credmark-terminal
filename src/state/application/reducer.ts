import { createReducer } from '@reduxjs/toolkit';

import {
  ApplicationModal,
  setOpenModal,
  setSidebarVisibility,
  updateBlockNumber,
} from './actions';

export interface ApplicationState {
  readonly blockNumber: { readonly [chainId: number]: number };
  readonly openModal: ApplicationModal | null;
  readonly sidebarVisibility: boolean;
}

const initialState: ApplicationState = {
  blockNumber: {},
  openModal: null,
  sidebarVisibility: true,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(updateBlockNumber, (state, action) => {
      const { chainId, blockNumber } = action.payload;
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber;
      } else {
        state.blockNumber[chainId] = Math.max(
          blockNumber,
          state.blockNumber[chainId],
        );
      }
    })
    .addCase(setOpenModal, (state, action) => {
      state.openModal = action.payload;
    })
    .addCase(setSidebarVisibility, (state, action) => {
      state.sidebarVisibility = action.payload;
    }),
);
