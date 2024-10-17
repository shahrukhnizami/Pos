import React, { useEffect, useState } from 'react';
import { Input, Modal, Space, Table, Switch, Select, Spin, Button } from 'antd';
import { db } from '../assets/Utills/firebase';
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const OrdersList = ({ searchQuery }) => {
  const [isViewing, setIsViewing] = useState(false); // For viewing order details
const [viewOrder, setViewOrder] = useState(null); // The order to view

  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState('all'); // State for order status (all/processed/unprocessed)
  const { Option } = Select;

  useEffect(() => {
    fetchOrdersFromDB();
  }, []);

  const fetchOrdersFromDB = async () => {
    setLoading(true);
    try {
      const ref = collection(db, 'orders');
      const ordersData = await getDocs(ref);
      if (!ordersData.empty) {
        const allOrders = ordersData.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setOrders(allOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };
  const view = (record) => {
    setIsViewing(true);
    setViewOrder({ ...record });
  };
  
  const edit = (record) => {
    setIsEditing(true);
    setEditOrder({ ...record });
  };

  const resetOrder = async () => {
    if (!editOrder) return;
    try {
      setLoading(true);
      const orderDoc = doc(db, 'orders', editOrder.id);
      await updateDoc(orderDoc, {
        totalAmount: editOrder.totalAmount,
        totalQuantity: editOrder.totalQuantity,
        isProcessed: editOrder.isProcessed,
      });

      toast.success('Order updated successfully');
      setIsEditing(false);
      fetchOrdersFromDB();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this order?',
      okType: 'danger',
      onOk: async () => {
        try {
          setLoading(true);
          await deleteDoc(doc(db, 'orders', record.id));
          toast.success('Order deleted');
          fetchOrdersFromDB();
        } catch (error) {
          toast.error('Error deleting order');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Filter orders based on status and search query
  const filteredOrders = orders.filter(order => {
    const statusFilter =
      orderStatus === 'all' || (orderStatus === 'processed' && order.isProcessed) || (orderStatus === 'unprocessed' && !order.isProcessed);

      const searchFilter =
      order.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerDetails?.name.toLowerCase().includes(searchQuery.toLowerCase())||
      order.totalAmount.toString().includes(searchQuery);

    // Combine both statusFilter and searchFilter
    return statusFilter && searchFilter;
  });

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer Name',
      dataIndex: ['customerDetails', 'name'], // Fetching from customerDetails object
      key: 'customerName',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Total Quantity',
      dataIndex: 'totalQuantity',
      key: 'totalQuantity',
    },
    {
      title: 'Processed',
      key: 'isProcessed',
      render: (record) => (
        <Switch
          checked={record.isProcessed}
          onChange={async (checked) => {
            try {
              const orderDoc = doc(db, 'orders', record.id);
              await updateDoc(orderDoc, { isProcessed: checked });
              toast.success(`Order marked as ${checked ? 'processed' : 'unprocessed'}`);
              fetchOrdersFromDB(); // Refresh the list
            } catch (error) {
              console.error('Error updating order status:', error);
              toast.error('Failed to update order status');
            }
          }}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => edit(record)} className="hover:text-green-500" />
          <DeleteOutlined onClick={() => handleDelete(record)} className="hover:text-red-500" />
          <Button onClick={() => view(record)}>Order Detail</Button>
        </Space>
      ),
    },
   
    
  ];

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* Dropdown to select processed, unprocessed, or all orders */}
          <Select
            value={orderStatus}
            onChange={(value) => setOrderStatus(value)}
            style={{ marginBottom: 16, width: 200 }}
          >
            <Option value="all">All Orders</Option>
            <Option value="processed">Processed Orders</Option>
            <Option value="unprocessed">Unprocessed Orders</Option>
          </Select>

          {/* Orders Table */}
          <Table columns={columns} dataSource={filteredOrders} rowKey="id" />

          {/* Edit Order Modal */}
          <Modal
            title="Editing Order"
            open={isEditing}
            okText="Save"
            onCancel={() => setIsEditing(false)}
            onOk={resetOrder}
          >
            <div className="flex flex-col gap-3">
              <label>Total Amount</label>
              <Input
                value={editOrder?.totalAmount}
                onChange={(e) => setEditOrder((prev) => ({ ...prev, totalAmount: e.target.value }))}
              />
              <label>Total Quantity</label>
              <Input
                value={editOrder?.totalQuantity}
                onChange={(e) => setEditOrder((prev) => ({ ...prev, totalQuantity: e.target.value }))}
              />
              <label>Status</label>
              <Select
                value={editOrder?.isProcessed ? 'processed' : 'unprocessed'}
                onChange={(value) => setEditOrder((prev) => ({ ...prev, isProcessed: value === 'processed' }))}
              >
                <Option value="processed">Processed</Option>
                <Option value="unprocessed">Unprocessed</Option>
              </Select>
            </div>
          </Modal>
          <Modal
  open={isViewing}
  onCancel={() => setIsViewing(false)}
  footer={null}
>
  {viewOrder && (
    <div>
      
      <h3 className='text-3xl py-2' >Order Detail</h3>
      <h3 >Order ID: {viewOrder.id}</h3>
      <h5>Customer Name:<strong> {viewOrder.customerDetails.name}</strong></h5>
      <h5>Phone Number: <strong>{viewOrder.customerDetails.phone}</strong></h5>
      <h5>Address:<strong> {viewOrder.customerDetails.address}</strong></h5>
      <h5>Total Amount:<strong> {viewOrder.totalAmount}</strong></h5>
      <h5>Total Quantity:<strong> {viewOrder.totalQuantity}</strong></h5>
      <h5>Status:<strong> {viewOrder.isProcessed ? 'Processed' : 'Unprocessed'}</strong></h5>
      
      <h3 className='text-3xl py-2'>Items</h3>
      {viewOrder.items?.map(item => (
        <div key={item.id}>
          <h5><strong>{item.title}</strong> - Quantity:<strong> {item.quantity}</strong></h5>
        </div>
      ))}
    </div>
  )}
</Modal>


        </>
      )}
      <ToastContainer />
    </>
  );
};
