import { useState } from "react";
import { Button, Form, Input } from "antd"; // Import Spin for loading indicator
import { AddUserDrawer } from "../../components/AddUserDrawer";
import { OrdersList } from "../../components/OrdersList"; // Make sure the import name matches your file

function Orders() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(""); // State for search query

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleAddUser = async (userData) => {
    try {
      // Add your user addition logic here
      // e.g., await addUserToDB(userData);
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      onClose(); // Close the drawer after adding user
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-5">
        <h1 className="text-2xl md:text-5xl font-bold">All Orders</h1>
        <Button 
          danger 
          type="primary" 
          onClick={showDrawer} 
          className="mt-4 md:mt-0"
        >
          Add User
        </Button>
      </div>
      
      <Form className="mb-4">
        <Form.Item label="Search" name="search" className="mb-0">
          <Input
            placeholder="Search Order"
            onChange={(e) => setQuery(e.target.value)} // Capture search query
          />
        </Form.Item>
      </Form>

      {/* Add User Drawer */}
      <AddUserDrawer onClose={onClose} open={open} onAddUser={handleAddUser} />
      
      {/* Orders List */}
      <OrdersList searchQuery={query} />
    </div>
  );
}

export default Orders;
