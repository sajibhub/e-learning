import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slices/auth/authSlice.js";
import OverViewSlice from "../slices/overview/overview.js"
import ProfileSlice from "../slices/profile/profileSlice.js"
import chartSlice from "../slices/overview/chartSlice.js"
import transactionSlice from "../slices/transaction/transactionSlice.js"
import usersSlice from "../slices/users/usersSlice.js"
import SingleTransactionSlice from "../slices/transaction/singleTransaction.js"
import courseCategorySlice from "../slices/course/courseCategorySlice.js";
import courseSlice from "../slices/course/courseSlice.js";
import moduleSlice from "../slices/course/courseModuleSlice.js"
import videoSlice from "../slices/course/courseVideoSlice.js"
import productCategorySlice from "../slices/product/productCategorySlice.js"
import productSlice from "../slices/product/productSlice.js"
import orderSlice from "../slices/order/orderSlice.js"


export const store = configureStore({
  reducer: {
    auth: authSlice,
    overview: OverViewSlice,
    chart: chartSlice,
    profile: ProfileSlice,
    transactions: transactionSlice,
    users: usersSlice,
    transaction: SingleTransactionSlice,
    courseCategory: courseCategorySlice,
    course: courseSlice,
    modules:moduleSlice,
    video:videoSlice,
    productCategory: productCategorySlice,
    product: productSlice,
    order: orderSlice
  },
  devTools: false
});
