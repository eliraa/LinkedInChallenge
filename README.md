- LinkedIn course Challenge: Create 3 Automated Tests 
https://practicesoftwaretesting.com/ 
  - Create an automated test that adds an item to the shopping cart, Goes through the checkout process and when paying select buy now pay later.
  - Create a visual test to the checkout flow to validate the final payment screen.
  - Create an API test against the endpoint /products/{unique_id}, ensuring the correct product details are returned.

- Hints:
  - The productIds automatically change every 2 hours, so you will need to find a way to get the current productId reliably for the API test.


  Solution: 
   All challenges are met, even more - created env variables, login and page navigation fixtures, locators that can be reused are also separated in POM 

   More positive scenarios will be created in future commits  