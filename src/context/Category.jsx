import { message } from "antd";
import { collection, getDocs } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../assets/Utills/firebase";

export const CategoryContext = createContext();

function CategoryContextProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoriesFromDB();
  }, []);

  const getCategoriesFromDB = async () => {
    try {
      setLoading(true);
      const ref = collection(db, "category");
      const categoryData = await getDocs(ref);
      if (!categoryData.empty) {
        const allCategories = [];
        categoryData.forEach((category) => {
          allCategories.push({ ...category.data(), id: category.id });
        });
        setCategories(allCategories);
        setLoading(false);
      }
    } catch (err) {
      message.error(err.message);
      setLoading(false);
    }
  };

  const updateCategory = (id, updatedCategory) => {
    const updatedCategories = categories.map((category) =>
      category.id === id ? { ...category, ...updatedCategory } : category
    );
    setCategories(updatedCategories);
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        setCategories,
        updateCategory,
      }}
    >
      {loading ? "Loading..." : children}
    </CategoryContext.Provider>
  );
}

export default CategoryContextProvider;
