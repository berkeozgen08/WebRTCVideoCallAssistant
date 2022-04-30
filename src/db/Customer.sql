CREATE TABLE [dbo].[Customer]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
	[FirstName] NVARCHAR(50) NOT NULL,
	[LastName] NVARCHAR(50) NOT NULL,
	CHECK ([FirstName] <> '' AND [LastName] <> ''),
	UNIQUE ([FirstName], [LastName])
)
