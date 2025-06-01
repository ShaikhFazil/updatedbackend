import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "company",
  initialState: {
    singleCompany: null,
    companies:[],
    searchCompanyByText:''
  },
  reducers: {
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },
    setCompanies:(state,action)=>{
      state.companies = action.payload;
    },
    setClearCompanies:(state) =>{
      state.companies = []
    },
    setSearchCompanyByText:(state,action) =>{
      state.searchCompanyByText = action.payload;
    }
  },
});

export const { setSingleCompany,setCompanies,setClearCompanies,setSearchCompanyByText } = companySlice.actions;
export default companySlice.reducer;
