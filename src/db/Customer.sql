CREATE TABLE [dbo].[Customer]
(
	[Id] INT NOT NULL PRIMARY KEY,
	[FirstName] NVARCHAR(50) NOT NULL,
	[LastName] NVARCHAR(50) NOT NULL,
	CHECK ([FirstName] <> '' AND [LastName] <> '')
)
