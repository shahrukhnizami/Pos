import { useState } from "react";
import { Button, Form, Input, Spin } from "antd";
import { StockList } from "../../components/StocksList";


function Stocks() {
  const [query, setQuery] = useState("");



 

  return (
    <div>
      <div className="flex justify-between mb-5">
        <h1 className="text text-5xl font-bold">Stock Inventory</h1>
       
      </div>
      <Form>
        <Form.Item label="Search Stock" name="search" type="text">
          <Input
            placeholder="Search Stock Item"
            onChange={(e) => setQuery(e.target.value)}
          />
        </Form.Item>
      </Form>

      
      <StockList searchQuery={query} /> {/* List of stock items based on search query */}
    </div>
  );
}

export default Stocks;
