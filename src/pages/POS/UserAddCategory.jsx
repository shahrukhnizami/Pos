import { useState } from "react";
import { Button, Form, Input } from "antd";
import CategoryList from "../../components/CategoryList";
import AddCategoryDrawer from "../../components/AddCategoryDrawer";

function UserAddCategory() {
  
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
        <h1 className="text text-5xl font-bold">All Category</h1>
        <Button danger type="primary" onClick={showDrawer}>
          Add New Category
        </Button>
      </div>
      
     

      {/* Add Product Drawer */}
      <AddCategoryDrawer onClose={onClose} open={open} />
{/* <AddCategoryDrawer/> */}
      {/* Pass the search query to ProductList */}
      <CategoryList searchQuery={query} />
    </div>
  );
}

export default UserAddCategory;
