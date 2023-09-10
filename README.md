# triveous-Assignment1
### How to run the project
- Install Node.js and npm
- Clone the GitHub Repository: git clone <repository_url>
- Navigate to the Project Directory: cd <directory_> 
- Install Dependencies: npm  install
- Start the Server: from the triveous-Assignment1 directory, run this command - nodemon src/index.js

## BACKEND - Ecommerce APIs

**Libraries used:**
**Express, mongoose, nodemon, jwt, bcrypt, joi**

## USER APIs

### POST user/register
- Create a user document from request body.
- Saved password in encrypted format. (used bcrypt)
- Provide joi validation.

### POST user/login
- Allow an user to login with their email and password.
- On a successful login attempt return the userId and a JWT token contatining the userId, exp, iat.
- Provide joi validation.


## CATEGORY APIs

### POST category/create
- Create a category document by providing name of category.

### GET category/get
- Fetch the list of all categories.


## PRODUCT APIs

### POST product/create
- Create a product document from request body by providing categoryId,title,description,price,availability(default- true).

### GET /products/:categoryId
- Fetch the detailed information of all or single product by category ID(provided in path params).

### GET product/:productId
- Fetch the detailed information of a product by its product ID(provided in path params).



## CART APIs
**(Authentication & Authorization)**

### POST cart/create/:userId
- Create a cart for the user if it does not exist. Else add product(s) in cart.
- Get cart id in request body.
- Get productId in request body.
- Make sure that cart exist.
- Add a product(s) for a user in the cart.
- Make sure the userId in params and in JWT token match.
- Make sure the user exist
- Make sure the product(s) are valid and not deleted.
- Get product(s) details in response body.

### PUT cart/update/:userId
- Updates a cart by either decrementing the quantity of a product by 1 or deleting a product from the cart.
- Get cart id in request body.
- Get productId in request body.
- Get key 'removeProduct' in request body. 
- Make sure that cart exist.
- Key 'removeProduct' denotes whether a product is to be removed({removeProduct: 0}) or its quantity has to be decremented by 1({removeProduct: 1}).
- Make sure the userId in params and in JWT token match.
- Make sure the user exist
- Get product(s) details in response body.
- Check if the productId exists and is not deleted before updating the cart.

### GET cart/get/:userId
- Returns cart summary of the user.
- Make sure that cart exist.
- Make sure the userId in params and in JWT token match.
- Make sure the user exist
- Get product(s) details in response body.

### DELETE cart/delete/:userId
- Deletes the cart for the user.
- Make sure that cart exist.
- Make sure the userId in params and in JWT token match.
- Make sure the user exist
- cart deleting means array of items is empty, totalItems is 0, totalPrice is 0.


## ORDER APIs
**(Authentication & Authorization)**

### POST /order/create/:userId/
- Create an order for the user
- Make sure the userId in params and in JWT token match.
- Make sure the user exist
- Get cart details in the request body
- provide cartId and cancellable(default-true) in request body

### PUT order/update/:userId
- Updates an order status
- Make sure the userId in params and in JWT token match.
- Make sure the user exist
- Get order id in request body
- Make sure the order belongs to the user
- Make sure that only a cancellable order could be canceled. Else send an appropriate error message and response.