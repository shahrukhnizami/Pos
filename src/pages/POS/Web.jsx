import React, { useContext, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Benefits from '../../components/Benefits';
import Newsletter from '../../components/Newsletter';
import CardsNew from '../../components/CardsNew';
import { CategoryContext } from '../../context/Category';
import { ProductContext } from '../../context/Products';

const Web = () => {
    const { categories } = useContext(CategoryContext); // Get categories from context
    const activeCategories = categories.filter(category => category.isActive === true);

    // State for the selected category name
    const [selectedCategory, setSelectedCategory] = useState('');

    // Log the active categories
    console.log("Active categories:", activeCategories);

    return (
        <div>
            <div className="super_container">
                {/* Header */}
                <Header />

                {/* Slider */}
                <div
                    className="main_slider"
                    style={{ backgroundImage: "url(images/slider_1.jpg)" }}
                >
                    <div className="container fill_height">
                        <div className="row align-items-center fill_height">
                            <div className="col">
                                <div className="main_slider_content">
                                    <h6>Spring / Summer Collection 2017</h6>
                                    <h1>Get up to 30% Off New Arrivals</h1>
                                    <div className="red_button shop_now_button">
                                        <a href="#">shop now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banner */}
                <div className="banner">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                <div
                                    className="banner_item align-items-center"
                                    style={{ backgroundImage: "url(images/banner_1.jpg)" }}
                                >
                                    <div className="banner_category">
                                        <a href="categories.html">women's</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div
                                    className="banner_item align-items-center"
                                    style={{ backgroundImage: "url(images/banner_2.jpg)" }}
                                >
                                    <div className="banner_category">
                                        <a href="categories.html">accessories</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div
                                    className="banner_item align-items-center"
                                    style={{ backgroundImage: "url(images/banner_3.jpg)" }}
                                >
                                    <div className="banner_category">
                                        <a href="categories.html">men's</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* New Arrivals */}
                <div className="new_arrivals">
                    <div className="container">
                        <div className="row">
                            <div className="col text-center">
                                <div className="section_title new_arrivals_title">
                                    <h2>New Arrivals</h2>
                                </div>
                            </div>
                        </div>
                        <div className="row align-items-center">
                            <div className="col text-center">
                                <div className="new_arrivals_sorting">
                                    <ul className="arrivals_grid_sorting clearfix button-group filters-button-group">
                                        <li
                                            className="grid_sorting_button button d-flex flex-column justify-content-center align-items-center active is-checked"
                                            data-filter="*"
                                        >
                                            all
                                        </li>
                                        {activeCategories.map((category) => (
                                            <li 
                                                key={category.id} 
                                                onClick={() => setSelectedCategory(category.categoryname)} // Set selected category name
                                                className="grid_sorting_button button ml-2 d-flex flex-column justify-content-center align-items-center"
                                                data-filter={`.${category.categoryname.toLowerCase()}`} // Adjusting filter to match category
                                            >
                                                {category.categoryname} 
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div
                                    className="product-grid d-flex flex-wrap justify-content-right align-items-row"
                                    data-isotope='{ "itemSelector": ".product-item", "layoutMode": "fitRows" }'
                                >
                                    {/* Product 1 */}
                                    <CardsNew />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Display Selected Category */}
                <div className="selected_category">
                    {selectedCategory && (
                        <h3>Selected Category: {selectedCategory}</h3>
                    )}
                </div>

                {/* Benefits */}
                <Benefits />

                {/* Newsletter */}
                <Newsletter />

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default Web;
