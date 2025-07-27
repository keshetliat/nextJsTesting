import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../app/types';

interface PopupState {
  selectedProduct: Product | null;
}

const initialState: PopupState = {
  selectedProduct: null,
};

const productListSlice = createSlice({
  name: 'popup',
  initialState,
  reducers: {
    openPopup: (state, action: PayloadAction<Product>) => {
      state.selectedProduct = action.payload;
    },
    closePopup: (state) => {
      state.selectedProduct = null;
    },
  },
});

export const { openPopup, closePopup } = productListSlice.actions;
export default productListSlice.reducer;
