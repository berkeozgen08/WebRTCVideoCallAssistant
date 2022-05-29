CREATE TABLE [dbo].[Meeting]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
	[CreatedBy] INT NOT NULL REFERENCES [dbo].[User](Id),
	[CreatedFor] INT NOT NULL REFERENCES [dbo].[Customer](Id),
	[UserConnId] CHAR(36) UNIQUE NOT NULL,
	[CustomerConnId] CHAR(36) UNIQUE NOT NULL,
	[UserSlug] CHAR(8) UNIQUE NOT NULL,
	[CustomerSlug] CHAR(8) UNIQUE NOT NULL,
	[StartsAt] DATETIME NOT NULL,
	[CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
	[StatId] INT REFERENCES [dbo].[Stat](Id)
)
