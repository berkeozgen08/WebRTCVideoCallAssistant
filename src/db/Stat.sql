CREATE TABLE [dbo].[Stat]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
	[UserVideoTime] INT,
	[UserSpeakTime] INT,
	[CustomerVideoTime] INT,
	[CustomerSpeakTime] INT,
	[StartedAt] DATETIME DEFAULT GETDATE(),
	[EndedAt] DATETIME
)
