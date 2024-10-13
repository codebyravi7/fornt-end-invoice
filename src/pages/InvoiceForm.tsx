import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, setCustomer, logout, resetProducts } from "../redux/store"; // Import resetProducts
import axios from "axios";
import ProductList from "../components/ProductList"; // Import the ProductList component

const InvoiceForm: React.FC = () => {
  const [customer, setCustomerState] = useState({ name: "", email: "" });
  const [product, setProduct] = useState({ name: "", qty: 0, price: 0 });
  const [isCustomerSet, setIsCustomerSet] = useState(false);
  const dispatch = useDispatch();
  const invoice = useSelector((state: any) => state.invoice);
  const token = useSelector((state: any) => state.auth.token);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerState({ ...customer, [e.target.name]: e.target.value });
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const addInvoiceProduct = () => {
    dispatch(addProduct(product));
    setProduct({ name: "", qty: 0, price: 0 }); // Reset product form after adding
  };

  const handleSubmit = () => {
    dispatch(setCustomer(customer)); // Set customer information
    setIsCustomerSet(true); // Flag to indicate customer is set
  };

  useEffect(() => {
    const generateInvoice = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/generate-invoice",
          invoice,
          {
            responseType: "blob",
            headers: {
              "Content-Type": "application/json",
              Auth: token,
            },
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        // Clean the product and customer information after the submission
        dispatch(resetProducts()); // Reset products
        setCustomerState({ name: "", email: "" }); // Clear customer state
      } catch (error) {
        console.error("Error generating invoice:", error);
      }
    };

    // Only generate the invoice if the customer has been set
    if (isCustomerSet && customer.name && customer.email) {
      generateInvoice();
      setIsCustomerSet(false); // Reset the flag
    }
  }, [isCustomerSet, customer, invoice, token, dispatch]); // Add dispatch to the dependency array


  return (
    <>
      <div className="mt-32 max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg border-2 border-blue-800">
        <h2 className=" text-4xl font-bold mb-6 text-blue-900 text-center border-b-2 border-yellow-300">
          Create Invoice
        </h2>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-700">
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Customer Name"
              value={customer.name}
              onChange={handleCustomerChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Customer Email"
              value={customer.email}
              onChange={handleCustomerChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-700">
            Add Product
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleProductChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="qty"
              placeholder="Quantity"
              value={product.qty}
              onChange={handleProductChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={handleProductChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={addInvoiceProduct}
            className={`mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out ${
              !(product.qty > 0 && product.name !== "")
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={!(product.qty > 0 && product.name !== "")}
          >
            Add Product
          </button>
        </div>

        {/* Showcase the added products using ProductList */}
        <ProductList />

        <button
          type="button"
          onClick={handleSubmit}
          className={`w-full px-4 py-2 rounded-md transition duration-300 ease-in-out ${
            !(invoice.products.length > 0)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          disabled={!(invoice.products.length > 0)}
        >
          Generate PDF Invoice
        </button>
      </div>
    </>
  );
};

export default InvoiceForm;
