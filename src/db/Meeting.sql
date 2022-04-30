CREATE TABLE [dbo].[Meeting]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
	[CreatedBy] INT NOT NULL REFERENCES [dbo].[User](Id),
	[CreatedFor] INT NOT NULL REFERENCES [dbo].[Customer](Id),
	[UserConnId] CHAR(36) NOT NULL,
	[CustomerConnId] CHAR(36) NOT NULL,
	[UserSlug] CHAR(10) NOT NULL,
	[CustomerSlug] CHAR(10) NOT NULL,
	[StartsAt] DATETIME NOT NULL,
	[CreatedAt] DATETIME NOT NULL DEFAULT GETDATE()
)
