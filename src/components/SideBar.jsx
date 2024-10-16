import React from 'react'

const SideBar = ({activeCategories}) => {
  return (
    <>
     <div className="sidebar">
    <div className="sidebar_section">
      <div className="sidebar_title">
        <h5>Product Category</h5>
      </div>
      <ul className="sidebar_categories">
        {activeCategories.map((category)=>(<li>
          <a href="#">{category.categoryname}</a>
        </li>))}
        
     
      </ul>
    </div>
    {/* Price Range Filtering */}
    <div className="sidebar_section">
      <div className="sidebar_title">
        <h5>Filter by Price</h5>
      </div>
      <p>
        <input
          type="text"
          id="amount"
          readOnly=""
          style={{ border: 0, color: "#f6931f", fontWeight: "bold" }}
        />
      </p>
      <div id="slider-range" />
      <div className="filter_button">
        <span>filter</span>
      </div>
    </div>
    {/* Sizes */}
    {/* <div className="sidebar_section">
      <div className="sidebar_title">
        <h5>Sizes</h5>
      </div>
      <ul className="checkboxes">
        <li>
          <i className="fa fa-square-o" aria-hidden="true" />
          <span>S</span>
        </li>
        <li className="active">
          <i className="fa fa-square" aria-hidden="true" />
          <span>M</span>
        </li>
        <li>
          <i className="fa fa-square-o" aria-hidden="true" />
          <span>L</span>
        </li>
        <li>
          <i className="fa fa-square-o" aria-hidden="true" />
          <span>XL</span>
        </li>
        <li>
          <i className="fa fa-square-o" aria-hidden="true" />
          <span>XXL</span>
        </li>
      </ul>
    </div> */}
    {/* Color */}
    {/* <div className="sidebar_section">
      <div className="sidebar_title">
        <h5>Color</h5>
      </div>
      <ul className="checkboxes">
        <li>
          <i className="fa fa-square-o" aria-hidden="true" />
          <span>Black</span>
        </li>
        <li className="active">
          <i className="fa fa-square" aria-hidden="true" />
          <span>Pink</span>
        </li>
        <li>
          <i className="fa fa-square-o" aria-hidden="true" />
          <span>White</span>
        </li>
        <li>
          <i className="fa fa-square-o" aria-hidden="true" />
          <span>Blue</span>
        </li>
        <li>
          <i className="fa fa-square-o" aria-hidden="true" />
          <span>Orange</span>
        </li>
        <li>
          <i className="fa fa-square-o" aria-hidden="true" />
          <span>White</span>
        </li>
        <li>
          <i className="fa fa-square-o" aria-hidden="true" />
          <span>Blue</span>
        </li>
        <li>
          <i className="fa fa-square-o" aria-hidden="true" />
          <span>Orange</span>
        </li>
        <li>
          <i className="fa fa-square-o" aria-hidden="true" />
          <span>White</span>
        </li>
        <li>
          <i className="fa fa-square-o" aria-hidden="true" />
          <span>Blue</span>
        </li>
        <li>
          <i className="fa fa-square-o" aria-hidden="true" />
          <span>Orange</span>
        </li>
      </ul>
      <div className="show_more">
        <span>
          <span>+</span>Show More
        </span>
      </div>
    </div> */}
  </div>
    </>
  )
}

export default SideBar
