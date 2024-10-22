import { useState } from "react";
import { Button, Form, Input } from "antd";
import ProductsList from "../../components/ProductsList";
import { AddProductDrawer } from "../../components/AddProductDrawer.jsx";

function Products() {
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
        <Button 
          danger 
          type="primary" 
          onClick={showDrawer} 
          className="mt-4 md:mt-0"
        >
          Add Products
        </Button>
      </div>

      {/* Search Input */}
      <Form>
        <Form.Item label="Search" name="search" className="mb-4">
          <Input
            placeholder="Search products"
            onChange={(e) => setQuery(e.target.value)} // Set the search query state
          />
        </Form.Item>
      </Form>

      {/* Add Product Drawer */}
      <AddProductDrawer onClose={onClose} open={open} />
      
      {/* Pass the search query to ProductsList */}
      <ProductsList searchQuery={query} />
    </div>
  );
}

export default Products;
