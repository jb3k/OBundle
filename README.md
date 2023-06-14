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

  -- `templates/components/common/responsive-img.html` (Line 40)
  ```
    <img
      img-src="{{getImageSrcset image use_default_sizes=true}}"
      hoverimage='{{getImageSrcset images.[1] use_default_sizes=true}}'
    />
  ```

  -- `assets/js/theme/category.js`
  
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


Result
  - Go to 'Special Item' Category tag on main page.
  - Hover over the product to see the effect.


Notes:

  - I found that each Stencil theme’s assets/ directory contains CSS, JavaScript, and image assets that help create the design of storefront pages. Therefore, since the hover feature was going to be implemented into the 'Special Item' category page, I did some digging in the assets directory and located the file `assets/js/theme/category.js`, then found, the template page that was linked to it at `templates/pages/category.html` which then led me to `templates/components/common/responsive-img.html` page which was the page that was controlling images for the categories. 

  - once I created the hover image, i realized that I needed a way to change the image back, so I had to create another method to remove the 2nd image once i hovered off of it. Also when applying to hover, needed to apply it on the container of the image not just the image.


  - The attr() method in jQuery is used to get or set the value of an attribute on an element. So I got the value from 

  - The getImageSrcset HandleBar helper is a replacement for getImage which allows you to generate either a single image URL (for an <img> src) or a list of image sizes for srcset. Using the srcset(opens in a new tab) attribute, you can specify a list of image sizes for the browser to choose from based on the expected size of the image on the page, the device's pixel density, and other factors.


# Documention Used:
- https://developer.bigcommerce.com/stencil-docs/storefront-customization/directory-structure#templates
- https://developer.bigcommerce.com/stencil-docs/storefront-customization/theme-assets
- https://developer.bigcommerce.com/stencil-docs/reference-docs/handlebars-helpers-reference





  
