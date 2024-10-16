import React, { useContext } from 'react'
import Header from '../components/Header'
import { CategoryContext } from '../context/Category';
import Category from './Admin/Category';
import SideBar from '../components/SideBar';
import ProductItems from '../components/ProductItems';

const Categories = () => {
  const { categories } = useContext(CategoryContext); 
  const activeCategories = categories.filter(category => category.isActive === true);
  return (
    <>
    <Header/>
    <div className="col product_section clearfix">
  {/* Breadcrumbs */}
  <div className="breadcrumbs d-flex flex-row align-items-center">
    <ul>
      <li>
        <a href="index.html">Home</a>
      </li>
      <li className="active">
        <a href="index.html">
          <i className="fa fa-angle-right" aria-hidden="true" />
          Men's
        </a>
      </li>
    </ul>
  </div>
  {/* Sidebar */}
 <SideBar  activeCategories={activeCategories}/>
  {/* Main Content */}
  <div className="main_content">
    {/* Products */}
    <ProductItems/>
  </div>
</div>

    </>
  )
}

export default Categories
