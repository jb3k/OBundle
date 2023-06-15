## Project Overview

- Preview code: No preview code because the store launched already.
- Site Link: [Store Link](https://demo-user.mybigcommerce.com)


## Set Up

1. Initial Setup was to downloaded and install the Stencil CLI for my local machine and created an API Account on my Store Dashboard. 
2. Clone Stencil's Cornerstone theme repo from documentation.
3. Install all dependencies with `npm i` in root directory of project, then run Stencil Commands to start

# Documention Used:
- https://developer.bigcommerce.com/stencil-docs/installing-stencil-cli/installing-stencil
- https://developer.bigcommerce.com/stencil-docs/installing-stencil-cli/live-previewing-a-theme



## Feature 1

Goal: Feature that will show the 'Special Item' product's second image when hovered. 

Walk Thru:

- `templates/components/common/responsive-img.html`
  ```
    <img
      img-src="{{getImageSrcset image use_default_sizes=true}}"
      hoverimage='{{getImageSrcset images.[1] use_default_sizes=true}}'
    />
  ```
  - Here we are using the getImageSrcset handlebar helper to grab the image we want to use as well as the image we want to hover over. 



- `assets/js/theme/category.js`
  
  ```
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
  ```

  - Here we are creating functions to find the image we are looking to show the second image, then remove the second image for the Special Item.


Result
  - Go to 'Special Item' Category tag on main page.
  - Hover over the product to see the effect.


Notes:

  - From Documentation, I found that each Stencil theme’s assets/ directory contains CSS, JavaScript, and image assets that help create the design of storefront pages. Therefore, since the hover feature was going to be implemented into the 'Special Item' category page, I did some digging in the assets directory and located the file `assets/js/theme/category.js`, then found, the template page that was linked to categories at `templates/pages/category.html` which then led me to `templates/components/common/responsive-img.html` page which was the page that was controlling images for the categories. 

  - once I created the hover image, i realized that I needed a way to change the image back, so I had to create another method to remove the 2nd image once i hovered off of it. Also when applying to hover, needed to apply it on the container of the image not just the image.


  - The attr() method in jQuery is used to get or set the value of an attribute on an element. So I got the value from 

  - The getImageSrcset HandleBar helper is a replacement for getImage which allows you to generate either a single image URL (for an <img> src) or a list of image sizes for srcset. Using the srcset(opens in a new tab) attribute, you can specify a list of image sizes for the browser to choose from based on the expected size of the image on the page, the device's pixel density, and other factors.


# Documention Used:
- https://developer.bigcommerce.com/stencil-docs/storefront-customization/directory-structure#templates
- https://developer.bigcommerce.com/stencil-docs/storefront-customization/theme-assets
- https://developer.bigcommerce.com/stencil-docs/reference-docs/handlebars-helpers-reference





## Feature 2

Goal: Add a button at the top of the category page labeled Add All To Cart. When clicked, the product will be added to the cart. Notify the user that the product has been added.

Walk Thru:


- `templates/pages/category.html`
  ```
    <div class="cart-notification">
      <div class="add-notification">
        Items were successfully added to the cart!
      </div>
    </div>

    ------------------------------

    {{#if category.name "===" "Special Item"}}
    <div class="add-all-button-container">
        <input type="button" class="button button--primary" id="add-all-to-cart" value="Add All To Cart" />
    </div>
    {{/if}}

  ```

  - add this notification where ever you want it to populate on the page. In our case uploaded at the top, so put it near the top of page. 
  - Here, I added the button near the top of the page as well with some already inputed css. 



- `assets/js/theme/category.js`
  ```
    $("#add-all-to-cart").on("click", this.onAddAllToCart.bind(this));

  ```

  - Here I am adding the functionality of the button I created. 


Result
  - Go to Special Items Category.
  - Click the button Add All To Cart at the top of the category.


Notes:

  - HandleBars.js briefing: uses a syntax that allows you to define placeholders, called "mustaches," in your HTML templates. These mustaches are replaced with actual data values when the template is rendered.

  - The createCart() function takes two arguments (route, cartItems)
      - route: The endpoint's request route.
      - cartItems: A lineItems array containing product IDs and quantities of the items we want to add.
  - getCart Method takes in two arguments (option, callback), callback is optional
      - option: Return product variant options.
      - callback: Asynchronous function the subject method calls to handle any results.
  - addCart()

  - can add injections as placeholders to inject dynamic data or values in a template. 

# Documention Used:
- https://developer.bigcommerce.com/stencil-docs/reference-docs/stencil-utils-api-reference
- https://handlebarsjs.com/guide/
- https://developer.bigcommerce.com/api-docs/storefront/tutorials/working-sf-apis



## Feature 3

Goal: If the cart has an item in it - show a button next to the Add All To Cart button which says Remove All Items. When clicked it should clear the cart and notify the user. Both buttons should utilize the Storefront API for completion.

Walk Thru:


- `templates/pages/category.html`
  ```
    <div class="cart-notification">
      <div class="remove-notification">
          Items were successfully removed from the cart!
      </div>
    </div>

    ------------------------------

    {{#if category.name "===" "Special Item"}}
    <div class="add-all-button-container">
      <input type="button" class="button button--danger" id="remove-all-items" value="Remove All Items"/>
    </div>
    {{/if}}

  ```

  - add this notification where ever you want it to populate on the page. In our case uploaded at the top, so put it near the top of page. 
  - Here, I added the button near the top of the page as well with some already inputed css. 



- `assets/js/theme/category.js`
  ```
      $("#remove-all-items").on("click", this.onRemoveAllItems.bind(this));

  ```

  - Here I am adding the functionality of the button I created. 


Result
  - Go to Special Items Category.
  - Click the button Remove All Items after clicking on Add All To Cart at the top of the category.


Notes:

  - To delete a line item from a cart, send a DELETE request to the Delete Cart Line Item endpoint and pass in the cartId and itemId to be deleted.

  - To getCart, we need to send a request to the Get a cart endpoint. By default, the cart response returns abbreviated product details.

  - I added functionality to check the cart and only display the buttons that make sense. So if the cart is empty, then display the add all to cart button, if has something only display the remove button. 

  - Added extra css styling into a file called 'assessment.scss'

# Documention Used:
- https://developer.bigcommerce.com/api-docs/storefront/tutorials/working-sf-apis#delete-a-cart-item
- https://developer.bigcommerce.com/docs/rest-storefront/carts/cart-items#delete-cart-line-item
- https://developer.bigcommerce.com/docs/rest-storefront/carts#get-a-cart




## Bonus

Goal: If a customer is logged in - at the top of the category page show a banner that shows some customer details (i.e. name, email, phone, etc). This should utilize the data that is rendered via Handlebars on the Customer Object.


Walk-Thru:

- `templates/components/common/header.html`
  ```
    {{#if customer}}
    <div class="customer-details-container">
        <div class="customer-about">
            <p class="customer-name">
                {{customer.name}}
            </p>
            <p class="customer-email">
                {{customer.email}}
            </p>
            <p class="customer-phone">
                {{customer.phone}}
            </p>
        </div>
    </div>
    {{/if}}
  ```

  - Here I am targetting the Hanldebar Customer to access their basic info if there is a customer. 

Notes:

  - First I had to locate where I wanted to add this additional feature and figured to put it on the home page. Similar to the first 3 features, I went straight to `templates/pages/home.html`. This led me to `templates/layout/base.html` then to the file `templates/components/common/header.html`.

  - Added extra css styling into a file called 'assessment.scss'


Documentation:

  - https://tutorial.djangogirls.org/en/template_extending/



## Issues

  - Deploying the actual project. Kept getting an error that said ThemeUploadError. I figured out that I need to make the them public, not just local. 
  - Solution: https://github.com/bigcommerce/stencil-cli/issues/734
  - (https://support.bigcommerce.com/s/question/0D51300003ZLilHCAT/where-is-the-preview-code?language=en_US)
