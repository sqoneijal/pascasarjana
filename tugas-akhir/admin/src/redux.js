import { createSlice } from "@reduxjs/toolkit";
import * as h from "~/Helpers";

export const redux = createSlice({
   name: "redux",
   initialState: {
      init: {},
      module: {},
      secondaryNav: [],
      detailNavActive: {},
      position: [],
      filter: {},
      showButton: false,
      buttonConfig: {},
   },
   reducers: {
      setInit: (state, { payload } = action) => {
         state.init = payload;
      },
      secondaryNav: (state, { payload } = action) => {
         state.secondaryNav = payload;
      },
      detailNavActive: (state, { payload } = action) => {
         state.detailNavActive = payload;
      },
      position: (state, { payload } = action) => {
         state.position = payload;
      },
      filter: (state, { payload } = action) => {
         state.filter = payload;
      },
      applyFilter: (state, { payload } = action) => {
         state.filter = { ...payload.data };
         h.handleFilterDatatable(payload.url, payload.data);
      },
      setModule: (state, { payload } = action) => {
         state.module = payload;
      },
      showButton: (state, { payload } = action) => {
         state.showButton = payload;
      },
      buttonConfig: (state, { payload } = action) => {
         state.buttonConfig = payload;
      },
   },
});
export const { init, setInit, setModule, secondaryNav, detailNavActive, position, applyFilter, filter, showButton, buttonConfig } = redux.actions;
export default redux.reducer;
