import React, { useContext, useEffect, useState } from 'react';
import { Input, Modal, Space, Table, Spin, Upload, Button, message, Select, Switch } from 'antd';
import { db, storage } from '../assets/Utills/firebase'; // Ensure you import Firebase storage here
import { collection, deleteDoc, doc, getDocs, updateDoc, query } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'; // For uploading images
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CategoryContext } from '../context/Category';

const ProductsList = ({ searchQuery }) => {
  const { categories } = useContext(CategoryContext); // Get categories from context
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null); // Store selected image file
  const [imageUrl, setImageUrl] = useState(null); // Store uploaded image URL
  const [uploading, setUploading] = useState(false); // Track upload progress

  useEffect(() => {
    getProductsFromDB();
  }, []);

  const getProductsFromDB = async () => {
    setLoading(true);
    const ref = collection(db, "products");
    const productData = await getDocs(ref);
    if (!productData.empty) {
      const allProducts = [];
      productData.forEach((productInfo) => {
        allProducts.push({ ...productInfo.data(), id: productInfo.id });
      });
      setProducts([...allProducts]);
    }
    setLoading(false);
  };

  const edit = (record) => {
    setIsEditing(true);
    setEditProduct({ ...record });
    setImageUrl(record.image); // Set initial image URL
    setImageFile(null); // Reset the selected image file
  };

  // Upload image to Firebase Storage
  const handleImageUpload = async () => {
    if (imageFile) {
      const storageRef = ref(storage, `products/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      setUploading(true); // Start uploading

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Optional: Can handle upload progress here
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            message.info(`Upload is ${Math.round(progress)}% done`);
          },
          (error) => {
            setUploading(false); // Stop uploading
            message.error('Image upload failed');
            reject(error);
          },
          async () => {
            setUploading(false); // Stop uploading
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setImageUrl(downloadUrl); // Update image URL state
            resolve(downloadUrl);
          }
        );
      });
    }
  };

  // Handle image file change
  const handleImageChange = ({ file }) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return;
    }
    setImageFile(file.originFileObj); // Store the selected file
  };

  const resetProduct = async () => {
    try {
      let updatedImageUrl = imageUrl;

      // Upload new image if a file is selected
      if (imageFile) {
        updatedImageUrl = await handleImageUpload();
      }

      // Update Firestore product document
      if (editProduct) {
        const productRef = doc(db, 'products', editProduct.id);
        await updateDoc(productRef, {
          title: editProduct.title,
          price: editProduct.price,
          quantity: editProduct.quantity,
          category: editProduct.category,
          description: editProduct.description,
          image: updatedImageUrl, // Update with new image URL
        });
        setIsEditing(false);
        toast.success('Product updated successfully');
        getProductsFromDB();
      }
    } catch (error) {
      message.error('Failed to update product');
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Are you sure to delete this product?',
      okType: 'danger',
      onOk: async () => {
        await deleteDoc(doc(db, `products/${record.id}`));
        toast.success('Product deleted successfully');
        getProductsFromDB();
      },
    });
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (imageUrl) => (
        <img
          src={imageUrl}
          alt="product"
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
        />
      ),
    },
    {
      title: 'Product Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title), // Sort alphabetically
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category), // Sort alphabetically by category
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description), // Sort alphabetically by description
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity, // Sort numerically by quantity
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <EditOutlined onClick={() => edit(record)} className="hover:text-green-500" />
          <DeleteOutlined onClick={() => handleDelete(record)} className="hover:text-red-500" />
        </Space>
      ),
    },
    {
      title: 'Enable/Disable',
      key: 'enable',
      render: (record) => (
        <Switch
          checked={record.isEnabled}
          onChange={async (checked) => {
            try {
              const productDoc = doc(db, 'products', record.id);
              await updateDoc(productDoc, { isEnabled: checked });
              toast.success(`Product ${checked ? 'enabled' : 'disabled'} successfully`);
              getProductsFromDB();
            } catch (error) {
              console.error('Error updating product status:', error);
              toast.error('Failed to update product status');
            }
          }}
        />
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
        <Table columns={columns} dataSource={filteredProducts} rowKey="id" />
      )}
      <Modal
        title="Edit Product"
        open={isEditing}
        okText="Save"
        onCancel={() => setIsEditing(false)}
        onOk={resetProduct}
      >
        <div className="flex flex-col gap-3">
          <label>Product Title</label>
          <Input
            value={editProduct?.title}
            onChange={(e) => setEditProduct((prev) => ({ ...prev, title: e.target.value }))}
          />
          <label>Product Price</label>
          <Input
            value={editProduct?.price}
            onChange={(e) => setEditProduct((prev) => ({ ...prev, price: e.target.value }))}
          />
          <label>Quantity</label>
          <Input
            value={editProduct?.quantity}
            onChange={(e) => setEditProduct((prev) => ({ ...prev, quantity: e.target.value }))}
          />
              <label>Product Category</label>
          <Select
            value={editProduct?.category} // Use the selected category
            onChange={(value) => setEditProduct((prev) => ({ ...prev, category: value }))} // Update category in editProduct
            style={{ width: '100%' }}
          >
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.categoryname}>
                {category.categoryname}
              </Select.Option>
            ))}
          </Select>
          <label>Product Description</label>
          <Input
            value={editProduct?.description}
            onChange={(e) => setEditProduct((prev) => ({ ...prev, description: e.target.value }))}
          />
          <label>Product Image</label>
          <Upload
            listType="picture-card"
            beforeUpload={() => false} // Prevent auto-upload
            onChange={handleImageChange}
            showUploadList={{ showPreviewIcon: true }}
            onRemove={() => {
              setImageFile(null); // Clear selected file
              setImageUrl(editProduct.image); // Reset to initial image
            }}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="product" style={{ width: '100%', height: '100%' }} />
            ) : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default ProductsList;
