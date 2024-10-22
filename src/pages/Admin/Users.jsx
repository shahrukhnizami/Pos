import { useState } from "react";
import { Button, Form, Input } from "antd"; 
import { UserList } from "../../components/UserList";
import { AddUserDrawer } from "../../components/AddUserDrawer";

function Users() {
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
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      onClose(); // Close the drawer after adding user
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-5">
        <h1 className="text-2xl md:text-5xl font-bold">All Users</h1>
        <Button danger type="primary" onClick={showDrawer} className="mt-4 md:mt-0">
          Add User
        </Button>
      </div>

      <Form>
        <Form.Item label="Search" name="search" className="mb-4">
          <Input
            placeholder="Search Users"
            onChange={(e) => setQuery(e.target.value)} // Capture search query
          />
        </Form.Item>
      </Form>

      <AddUserDrawer onClose={onClose} open={open} onAddUser={handleAddUser} />

      <UserList searchQuery={query} />
    </div>
  );
}

export default Users;
