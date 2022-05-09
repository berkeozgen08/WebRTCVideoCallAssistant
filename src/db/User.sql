CREATE TABLE [dbo].[User]
(
	[Id] INT PRIMARY KEY IDENTITY(1, 1),
	[FirstName] NVARCHAR(64) NOT NULL,
	[LastName] NVARCHAR(64) NOT NULL,
	[Email] NVARCHAR(64) UNIQUE NOT NULL,
	[Password] NVARCHAR(64) NOT NULL,
	[Phone] CHAR(13) UNIQUE NOT NULL,
	CHECK ([FirstName] <> '' AND [LastName] <> '' AND [Email] <> '')
)
