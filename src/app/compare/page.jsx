import React from 'react';
import { CompareProvider, useCompare } from '../features/compare-products/model/CompareContext';
import { X, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

function CompareContent() {
  const { items, removeItem, clearAll, count } = useCompare();
  
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProducts() {
      if (items.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const variantIds = items.map(item => item.variantId);
        const res = await fetch(`/api/products/compare?ids=${variantIds.join(',')}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [items]);

  if (count === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Products to Compare</h1>
          <p className="text-gray-600 mb-6">Add products to compare using the compare button on product cards.</p>
          <Link 
            href="/catalog" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const allSpecs = new Set();
  products.forEach(product => {
    product?.products?.product_specs?.forEach(spec => {
      allSpecs.add(spec.key);
    });
  });
  const specsArray = Array.from(allSpecs);

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Compare Products</h1>
          <button
            onClick={clearAll}
            className="text-gray-600 hover:text-red-600"
          >
            Clear All
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
              <thead>
                <tr>
                  <th className="p-4 text-left bg-gray-50 w-48"></th>
                  {products.map(product => product && (
                    <th key={product.id} className="p-4 text-left bg-gray-50 min-w-[250px]">
                      <div className="relative">
                        <button
                          onClick={() => removeItem(product.id.toString())}
                          className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        >
                          <X size={16} />
                        </button>
                        <div className="aspect-square relative mb-3 bg-gray-100 rounded-lg overflow-hidden">
                          {product.product_images?.[0]?.url ? (
                            <img
                              src={product.product_images[0].url}
                              alt={product.products?.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-800 line-clamp-2">
                          {product.products?.name}
                        </h3>
                        {product.variant_name && (
                          <p className="text-sm text-gray-500">{product.variant_name}</p>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">Price</td>
                  {products.map(product => product && (
                    <td key={product.id} className="p-4">
                      <span className="text-xl font-bold text-blue-600">
                        ${(product.price_cents / 100).toFixed(2)}
                      </span>
                    </td>
                  ))}
                </tr>

                <tr className="border-t">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">Availability</td>
                  {products.map(product => product && (
                    <td key={product.id} className="p-4">
                      {product.stock_quantity > 0 ? (
                        <span className="text-green-600 font-medium">In Stock ({product.stock_quantity})</span>
                      ) : (
                        <span className="text-red-500 font-medium">Out of Stock</span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr className="border-t">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">Category</td>
                  {products.map(product => product && (
                    <td key={product.id} className="p-4 text-gray-600">
                      {product.products?.categories?.name || 'N/A'}
                    </td>
                  ))}
                </tr>

                {specsArray.map(specKey => (
                  <tr key={specKey} className="border-t">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50">{specKey}</td>
                    {products.map(product => {
                      const spec = product?.products?.product_specs?.find(s => s.key === specKey);
                      return (
                        <td key={product?.id} className="p-4 text-gray-600">
                          {spec?.value || '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                <tr className="border-t">
                  <td className="p-4 bg-gray-50"></td>
                  {products.map(product => product && (
                    <td key={product.id} className="p-4">
                      {product.stock_quantity > 0 ? (
                        <Link
                          href={`/catalog/${product.products?.category_id}/${product.id}?product=${product.products?.name}&variant=${product.variant_name}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          <ShoppingCart size={18} />
                          View Product
                        </Link>
                      ) : (
                        <span className="text-gray-400">Unavailable</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <CompareProvider>
      <CompareContent />
    </CompareProvider>
  );
}
