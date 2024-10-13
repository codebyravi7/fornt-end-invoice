// src/redux/store.ts
import {
  configureStore,
  createSlice,
  PayloadAction,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios"; // Import axios for API calls

interface Product {
  name: string;
  qty: number;
  price: number;
}

interface Customer {
  name: string;
  email: string;
}

interface Invoice {
  _id: string;
  customer_name: string;
  customer_email: string;
  products: {
    product_name: string;
    product_price: number;
    product_quantity: number;
  }[];
  createdAt: string; // or Date, depending on your preference
}

interface InvoiceState {
  customer: Customer;
  products: Product[];
  total: number;
  gst: number;
  invoices: Invoice[]; // Add invoices property
}

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  token: string | null; // Add token field
  loading: boolean;
  error: string | null;
}

// Initial states
const initialInvoiceState: InvoiceState = {
  customer: { name: "", email: "" },
  products: [],
  total: 0,
  gst: 0,
  invoices: [],
};

// Check localStorage for token to persist authentication
const token = localStorage.getItem("token");
const initialAuthState: AuthState = {
  isAuthenticated: !!token, // Set true if token exists
  user: token ? JSON.parse(localStorage.getItem("user") || "null") : null, // Retrieve user info from localStorage
  token: token, // Initialize with token from localStorage
  loading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        credentials
      );
      return response.data; // Assume the API returns user data and token
    } catch (error) {
      return rejectWithValue("Login failed. Please check your credentials."); // Handle error
    }
  }
);

// Async thunk for signup
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (
    userData: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        userData
      );
      return response.data; // Assume the API returns user data and token
    } catch (error) {
      return rejectWithValue("Signup failed. Please check your information."); // Handle error
    }
  }
);
export const fetchInvoices = createAsyncThunk(
  "invoice/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/invoice/fetchAll"
      );
      return response?.data; // Assume the API returns an array of invoices
    } catch (error) {
      return rejectWithValue("Failed to fetch invoices."); // Handle error
    }
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState: initialInvoiceState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
      state.total += action.payload.qty * action.payload.price;
      state.gst = state.total * 0.18;
    },
    setCustomer: (state, action: PayloadAction<Customer>) => {
      state.customer = action.payload;
    },
    resetProducts: (state) => {
      // Reset products reducer
      state.products = [];
      state.total = 0;
      state.gst = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchInvoices.fulfilled,
      (state, action: PayloadAction<Invoice[]>) => {
        state.invoices = action.payload; // Save fetched invoices in state
      }
    );
  },
});

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null; // Reset token on logout
      localStorage.removeItem("token"); // Remove token from localStorage
      localStorage.removeItem("user"); // Remove user info from localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (
          state,
          action: PayloadAction<{
            token: string;
            user: { name: string; email: string };
          }>
        ) => {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token; // Store token in state
          state.loading = false;

          // Store token and user in localStorage
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Set error message
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        signupUser.fulfilled,
        (
          state,
          action: PayloadAction<{
            token: string;
            user: { name: string; email: string };
          }>
        ) => {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token; // Store token in state
          state.loading = false;

          // Store token and user in localStorage
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      )
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Set error message
      });
  },
});

// Export actions from the slices
export const { addProduct, setCustomer,resetProducts } = invoiceSlice.actions;
export const { logout } = authSlice.actions;

// Configure the store
export const store = configureStore({
  reducer: {
    invoice: invoiceSlice.reducer,
    auth: authSlice.reducer,
  },
});
