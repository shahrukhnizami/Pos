import { useState } from "react";
import { Button, Form, Input } from "antd";
import ProductList from "../../components/ProductsList";
import { AddProductDrawer } from "../../components/AddProductDrawer";

export function UserAddProducts() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(''); // State for search query

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-5">
        <h1 className="text-2xl md:text-5xl font-bold">All Products</h1>
        <Button danger type="primary" onClick={showDrawer} className="mt-4 md:mt-0">
          Add Products
        </Button>
      </div>

      {/* Search Input */}
      <Form className="mb-4">
        <Form.Item label="Search" name="search" className="mb-0">
          <Input
            placeholder="Search products"
            onChange={(e) => setQuery(e.target.value)} // Set the search query state
          />
        </Form.Item>
      </Form>

      {/* Add Product Drawer */}
      <AddProductDrawer onClose={onClose} open={open} />

      {/* Pass the search query to ProductList */}
      <ProductList searchQuery={query} />
    </div>
  );
}
