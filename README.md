# Simple Order Management System

This project aims to develop a simple order management system with the following functionalities:

1. **User Information**: Stores user details including name, phone number, email, gender, password (hashed and salted for security), and role ID.
2. **Role Information**: Stores role names.
3. **Role-User Mapping**: Maps roles to users allowing a user to have multiple roles.
4. **Customer Information**: Contains customer details such as customer name, code, address, phone number, and email.
5. **Product Information**: Stores product details including name, color ID, and size (S-M-L-XL).
6. **Warehouse Information**: Tracks the stock of products in the warehouse including product ID, quantity, and availability for sale.
7. **Order Information**: Records orders with customer ID, product ID, and quantity.

### User Roles and Permissions

- **Administrator**
- **User**
- **Customer Representative**

### Pages and Access Roles

- **Login Page**: Accessible by all users.
- **User Management**: Role: Administrator
- **Role Management**: Role: Administrator
- **Customer Management**: Role: Administrator, Customer Representative
- **Product Management**: Role: Administrator, Customer Representative, User
- **Order Management**: Role: Customer Representative
- **Warehouse Report Screen**: Role: Administrator, Customer Representative, User
- **Order Report Screen**: Role: Administrator, Customer Representative, User

### Functionality Overview

- **Sales Representative**: Validates order information received from the customer on the warehouse report screen and creates an order record if the sale is possible.
- If the Sales Representative does not perform necessary checks on the warehouse report screen and attempts to place an order for products that are not in stock, they should receive a warning, and the transaction should not be allowed to proceed.

### Technology Stack

- **Database**: MS SQL
- **Back-end**: .NET Core with multi-layered architecture
- **Front-end**: Angular CLI
- **Development Framework**: .NET 5 using Dev Architecture extensions for rapid application development.

### Additional Requirements

- Body sizes should be stored as enums in the project.
- Color definition in the product definition page should open a modal through a button (using Angular Dialog) where previously defined colors can be viewed and managed (Create/Update/Delete).
- Additional columns can be freely added to the above tables if necessary.
- Deletion of records should not result in actual data deletion from the database. Instead, the `IsDeleted` column should be set to true to prevent the data from being displayed on the front-end.

### Database Schema

All tables must contain the following columns:

- `Id` (int)
- `CreatedUserId` (int)
- `CreatedDate` (DateTime)
- `LastUpdatedUserId` (int)
- `LastUpdatedDate` (DateTime)
- `Status` (bool)
- `IsDeleted` (bool)

These attributes can be added to the BaseEntity in the Dev Architecture.

### Development Guidelines

- Use English keywords throughout the codebase.

This README provides an overview of the project's requirements and functionalities before development begins.
