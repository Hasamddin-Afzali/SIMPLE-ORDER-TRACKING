Simple Order System

User Information (FullName, PhoneNumber, Email, Gender, Password, RoleId)
Password should not be visible in the database. Password Salt/Hash.
Role Information (Name)
Role-User Mapping (RoleId, UserId)
A User can have multiple roles.
Customer Information (CustomerName, CustomerCode, Address, PhoneNumber, Email)
Product Information (Name, ColorId, Size(S-M-L-XL))
Warehouse Information (ProductId, Quantity, ReadyForSale?)
Order Information (CustomerId, ProductId, Quantity)
Users in the system are our company's white-collar employees.
The system will only be used within the company.
Login is mandatory to access the pages.

Roles:
Administrator
User
Sales Representative

Pages:
Login Page,
User Definition Page, Role:(Administrator)
Role Definition Page, Role:(Administrator)
Customer Definition Page, Role:(Administrator, Sales Representative)
Product Definition Page, Role:(Administrator, Sales Representative, User)
Order Definition Page, Role:(Sales Representative)
Warehouse Report Screen, Role:(Administrator, Sales Representative, User)
Order Report Screen, Role:(Administrator, Sales Representative, User)

Our Sales Representative checks the order information obtained from the customer on the warehouse report screen and, if the sale is possible, creates the order record.
The Sales Representative may not perform the necessary checks on the Warehouse Report Screen. If they attempt to place an order for products that are not in stock, they should receive a warning and should not be allowed to proceed with the transaction.

In the project, MS Sql is requested as the database, .net Core multi-layered architecture as the back-end, and Angular CLI as the front-end.
The project is requested to be developed using the Dev Architecture extensions, which is a fast application framework developed for .Net 5.
Thanks to Dev Architecture, User, Role, and page authorizations will be ready in the system. You don't need to create an extra class.
Body information is expected to be kept as an enum within the project. The body information stored as int in the database should appear as a string to the user. You can do this by writing the string equivalents of int values in the Enum.
Color definition will open a modal with a button on the Product definition page (Use Angular Dialog). Previously defined colors can be displayed in the modal. Create/Update/Delete can be done.
If needed, you are free to add new columns to the tables above.
When deletion is performed in the system, data should not be deleted from the database. The IsDeleted column should be set to true to prevent the data from being displayed in the front-end.

All tables must have the following columns:
int Id { get; set; }
int CreatedUserId { get; set; }
DateTime CreatedDate { get; set; }
int LastUpdatedUserId { get; set; }
DateTime LastUpdatedDate { get; set; }
bool Status { get; set; }
bool isDeleted { get; set; }
