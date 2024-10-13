import React from "react";
import { useSelector } from "react-redux";
import { ShoppingBag, Package, DollarSign, CreditCard } from "lucide-react";

const ProductList: React.FC = () => {
  const products = useSelector((state: any) => state.invoice.products);

  const totalAmount = products.reduce(
    (sum: number, product: any) => sum + product.qty * product.price,
    0
  );

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
      <div className="bg-indigo-600 px-4 py-3 border-b border-indigo-500">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <ShoppingBag className="mr-2" size={20} />
          Products in Invoice
        </h3>
      </div>
      {products.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-500 italic">No products added yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {products.map((product: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 hover:bg-gray-50"
            >
              <div className="flex-1 flex items-center">
                <Package className="mr-3 text-indigo-500" size={18} />
                <div>
                  <h4 className="text-sm font-medium text-gray-800">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {product.qty} {product.qty === 1 ? "pc" : "pcs"} @
                    <span className="text-emerald-600 font-medium ml-1">
                      Rs.{product.price}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-emerald-600 flex items-center">
                  Rs.{(product.qty * product.price)}
                </p>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center p-4 bg-indigo-50 font-semibold">
            <span className="text-indigo-800 flex items-center">
              <CreditCard className="mr-2" size={18} />
              Total Amount:
            </span>
            <span className="text-indigo-800">Rs.{totalAmount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
