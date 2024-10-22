import React, { useContext, useEffect, useState } from 'react';
import { Input, Modal, Space, Table, Spin, Upload, message, Select, Switch } from 'antd';
import { db, storage } from '../assets/Utills/firebase'; 
import { collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'; 
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CategoryContext } from '../context/Category';

const ProductsList = ({ searchQuery }) => {
  const { categories } = useContext(CategoryContext);
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    setImageUrl(record.image);
    setImageFile(null);
  };

  const handleImageUpload = async () => {
    if (imageFile) {
      const storageRef = ref(storage, `products/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      setUploading(true);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            message.info(`Upload is ${Math.round(progress)}% done`);
          },
          (error) => {
            setUploading(false);
            message.error('Image upload failed');
            reject(error);
          },
          async () => {
            setUploading(false);
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            setImageUrl(downloadUrl);
            resolve(downloadUrl);
          }
        );
      });
    }
  };

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
    setImageFile(file.originFileObj);
  };

  const resetProduct = async () => {
    try {
      let updatedImageUrl = imageUrl;
      if (imageFile) {
        updatedImageUrl = await handleImageUpload();
      }

      if (editProduct) {
        const productRef = doc(db, 'products', editProduct.id);
        await updateDoc(productRef, {
          title: editProduct.title,
          price: editProduct.price,
          quantity: editProduct.quantity,
          category: editProduct.category,
          description: editProduct.description,
          image: updatedImageUrl,
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
          className="w-12 h-12 object-cover rounded-lg"
        />
      ),
    },
    {
      title: 'Product Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
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
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          scroll={{ x: 'max-content' }} // Enable horizontal scrolling on smaller screens
          className="w-full"
        />
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
            className="w-full"
          />
          <label>Product Price</label>
          <Input
            value={editProduct?.price}
            onChange={(e) => setEditProduct((prev) => ({ ...prev, price: e.target.value }))}
            className="w-full"
          />
          <label>Quantity</label>
          <Input
            value={editProduct?.quantity}
            onChange={(e) => setEditProduct((prev) => ({ ...prev, quantity: e.target.value }))}
            className="w-full"
          />
          <label>Product Category</label>
          <Select
            value={editProduct?.category}
            onChange={(value) => setEditProduct((prev) => ({ ...prev, category: value }))}
            className="w-full"
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
            className="w-full"
          />
          <label>Product Image</label>
          <Upload
            listType="picture-card"
            beforeUpload={() => false}
            onChange={handleImageChange}
            showUploadList={{ showPreviewIcon: true }}
            onRemove={() => {
              setImageFile(null);
              setImageUrl(editProduct.image);
            }}
            className="w-full"
          >
            {imageUrl ? (
              <img src={imageUrl} alt="product" className="w-full h-full object-cover" />
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
