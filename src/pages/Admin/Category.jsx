import { useState } from "react";
import { Button, Form, Input } from "antd";
import AddCategoryDrawer from "../../components/AddCategoryDrawer";
import CategoryList from "../../components/CategoryList";

function Category() {
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
        <h1 className="text-2xl md:text-5xl font-bold">All Categories</h1>
        <Button 
          danger 
          type="primary" 
          onClick={showDrawer} 
          className="mt-4 md:mt-0"
        >
          Add New Category
        </Button>
      </div>
      

      {/* Add Category Drawer */}
      <AddCategoryDrawer onClose={onClose} open={open} />

      {/* Pass the search query to CategoryList */}
      <CategoryList searchQuery={query} />
    </div>
  );
}

export default Category;
