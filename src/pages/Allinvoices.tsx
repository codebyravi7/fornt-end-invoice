import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices } from "../redux/store"; // Adjust the path as necessary
import { ChevronDown, ChevronUp, Mail, User } from "lucide-react";
import { AppDispatch } from "../redux/store"; // Adjust the import based on your project structure

const InvoicesPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const invoices = useSelector(
    (state: any) => state.invoice.invoices?.invoices
  );
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const toggleInvoice = (id: string) => {
    setExpandedInvoice(expandedInvoice === id ? null : id);
  };

  const calculateTotal = (products: any[]) => {
    return products
      .reduce(
        (total, product) =>
          total + product.product_quantity * product.product_price,
        0
      )
      .toFixed(2);
  };

  // Formatting function for the date
  const formattedDate = (createdAt: string) => {
    return new Date(createdAt).toLocaleString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mt-24 container mx-auto px-4 py-8">
      <h1 className="text-center text-4xl font-bold mb-6 border-b-2">
        Invoices
      </h1>
      {invoices && invoices.length > 0 ? (
        invoices.map((invoice: any) => (
          <div
            key={invoice._id}
            className="bg-white shadow-md rounded-lg mb-4 overflow-hidden"
          >
            <div
              className="p-4 cursor-pointer flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
              onClick={() => toggleInvoice(invoice._id)}
            >
              <h2 className="text-lg font-semibold">{invoice.customer_name}</h2>
              <span className="text-gray-500">
                {expandedInvoice === invoice._id ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </span>
            </div>
            {expandedInvoice === invoice._id && (
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <User className="mr-2 text-gray-600" size={20} />
                    <span>{invoice.customer_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="mr-2 text-gray-600" size={20} />
                    <span>{invoice.customer_email}</span>
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Products:</h3>
                <ul className="space-y-2">
                  {invoice.products.map((product: any) => (
                    <li key={product._id} className="bg-gray-50 p-2 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {product.product_name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {product.product_quantity} x ${product.product_price}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                {/* Display formatted date */}
                <div className="mt-4 flex justify-between items-center">
                  <div className="createdAt">
                    {formattedDate(invoice?.createdAt)}
                  </div>
                  <div className=" flex justify-end items-center">
                    <span className="font-bold text-lg">
                      Total: ${calculateTotal(invoice.products)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No invoices found.</p>
      )}
    </div>
  );
};

export default InvoicesPage;
