import { hooks } from '@bigcommerce/stencil-utils';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';
import { createTranslationDictionary } from '../theme/common/utils/translations-utils';

const CART_API = '/api/storefront/carts';

export default class Category extends CatalogPage {
    constructor(context) {
        super(context);
        this.validationDictionary = createTranslationDictionary(context);
    }

    setLiveRegionAttributes($element, roleType, ariaLiveStatus) {
        $element.attr({
            role: roleType,
            'aria-live': ariaLiveStatus,
        });
    }

    makeShopByPriceFilterAccessible() {
        if (!$('[data-shop-by-price]').length) return;

        if ($('.navList-action').hasClass('is-active')) {
            $('a.navList-action.is-active').focus();
        }

        $('a.navList-action').on('click', () => this.setLiveRegionAttributes($('span.price-filter-message'), 'status', 'assertive'));
    }

    onProductShowSecondImage(e) {
        const productCard = $(e.currentTarget).find('.card-image');
        const productImage = productCard.attr('hoverimage');
        productCard.attr('srcset', productImage);
    }

    onProductRemoveSecondImage(e) {
        const productCard = $(e.currentTarget).find('.card-image');
        const productImage = productCard.attr('img-src');
        productCard.attr('srcset', productImage);
    }

    createCart(url, items) {
        const cartItems = {
            lineItems: items,
        };
        const body = JSON.stringify(cartItems);

        return fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body,
        }).then(response => response.json());
    }

    getCart(route) {
        return fetch(route, {
            method: 'GET',
            credentials: 'same-origin'
        })
            .then(response => response.json())
            .catch(error => console.error(error));
    };

    onAddAllToCart() {
        let products = [];
        for (let i = 0; i < this.context.categoryProducts.length; i++) {
            products = [
                ...products,
                {
                    quantity: this.context.categoryProducts[i].qty_in_cart + 1,
                    productId: this.context.categoryProducts[i].id
                }
            ];
        }
        this.createCart(CART_API, products)
            .then(data => {
                if (data) {
                    $('.add-notification').css('display', 'block');
                    setTimeout(() => {
                        $('.add-notification').css('display', 'none');
                        this.onCheckCart();

                    }, 4000);
                }
            })
            .catch(err => console.error(err));
    }

    deleteCartItems(url, cartId) {
        return fetch(`${url}/${cartId}`, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response);
    }

    onRemoveAllItems() {
        this.getCart(
            `${CART_API}?include=lineItems.digitalItems.options,lineItems.physicalItems.options`
        )
            .then(data => this.deleteCartItems(CART_API, data[0].id))
            .then(data => {
                if (data) {
                    $('#remove-all-items').css('display', 'none');
                    $('.add-notification').css('display', 'none');
                    $('.remove-notification').css('display', 'block');
                    setTimeout(() => {
                        $('.remove-notification').css('display', 'none');
                        this.onCheckCart();

                    }, 4000);
                }
            })
            .catch(err => console.error(err));
    }

    onCheckCart() {
        this.getCart(
            `${CART_API}?include=lineItems.digitalItems.options,lineItems.physicalItems.options`
        )
            .then(data => {
                if (data.length > 0) {
                    $('#remove-all-items').css('display', 'block');
                    $('#add-all-to-cart').css('display', 'none');

                } else {
                    $('#add-all-to-cart').css('display', 'block');
                    $('#remove-all-items').css('display', 'none');

                }
            })
            .catch(err => console.error(err));
    }

    onReady() {
        this.arrangeFocusOnSortBy();

        $("[data-button-type='add-cart']").on('click', (e) => this.setLiveRegionAttributes($(e.currentTarget).next(), 'status', 'polite'));

        this.makeShopByPriceFilterAccessible();

        compareProducts(this.context);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        this.onCheckCart();
        $('#add-all-to-cart').on('click', this.onAddAllToCart.bind(this));
        $('#remove-all-items').on('click', this.onRemoveAllItems.bind(this));
        $('.card-img-container').hover(
            this.onProductShowSecondImage.bind(this),
            this.onProductRemoveSecondImage.bind(this),
        );


        $('a.reset-btn').on('click', () => this.setLiveRegionsAttributes($('span.reset-message'), 'status', 'polite'));

        this.ariaNotifyNoProducts();
    }

    ariaNotifyNoProducts() {
        const $noProductsMessage = $('[data-no-products-notification]');
        if ($noProductsMessage.length) {
            $noProductsMessage.focus();
        }
    }

    initFacetedSearch() {
        const {
            price_min_evaluation: onMinPriceError,
            price_max_evaluation: onMaxPriceError,
            price_min_not_entered: minPriceNotEntered,
            price_max_not_entered: maxPriceNotEntered,
            price_invalid_value: onInvalidPrice,
        } = this.validationDictionary;
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        }, {
            validationErrorMessages: {
                onMinPriceError,
                onMaxPriceError,
                minPriceNotEntered,
                maxPriceNotEntered,
                onInvalidPrice,
            },
        });
    }
}
