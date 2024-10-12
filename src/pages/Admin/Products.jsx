import { useState } from "react";
// import AddProductDrawer from "../../components/AddProductDrawer";
import { Button, Form, Input } from "antd";
import ProductsList from "../../components/ProductsList";
import { AddProductDrawer } from "../../components/AddProductDrawer.jsx";
// import ProductList from "../../components/ProductsList";

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
    <div>
      <div className="flex justify-between mb-5">
        <h1 className="text text-5xl font-bold">All Products</h1>
        <Button danger type="primary" onClick={showDrawer}>
          Add Products
        </Button>
      </div>
      
      {/* Search Input */}
      <Form>
      <Form.Item label="Search" name="search" type="text">
        <Input
          placeholder="Search products"
          onChange={(e) => setQuery(e.target.value)} // Set the search query state
        />
      </Form.Item>
      </Form>

      {/* Add Product Drawer */}
      {/* <AddProductDrawer onClose={onClose} open={open} /> */}
      <AddProductDrawer onClose={onClose} open={open}/>
{/* <AddProductDrawer/> */}
      {/* Pass the search query to ProductList */}
      
      <ProductsList searchQuery={query}/>
    </div>
  );
}

export default Products;
