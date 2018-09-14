CREATE TABLE [dbo].[BTCRAAPP_TOKEN_SESION](
	[IdTokenSesion] [int] IDENTITY(1,1) NOT NULL,
	[IdConductor] [int] NOT NULL DEFAULT ((0)),
	[UuidDispositivo] [nvarchar](30) NOT NULL DEFAULT (''),
	[Token] [nvarchar](70) NOT NULL,
	[TokenActivo] [bit] NOT NULL DEFAULT ((1)),
	[SesionActiva] [bit] NOT NULL DEFAULT ((0)),
	[Caducidad] [datetime] NOT NULL DEFAULT (getutcdate()),
	[UltimoUso] [datetime] NOT NULL DEFAULT (getutcdate()),
	[FechaAlta] [datetime] NOT NULL DEFAULT (getutcdate()),



[IdTokenSesion] [int] IDENTITY(1,1) NOT NULL,
	[IdConductor] [int] NOT NULL DEFAULT 0,
	[UuidDispositivo] [nvarchar](20) NOT NULL DEFAULT '',
	[Token] [nvarchar](70) NOT NULL,
	[TokenActivo] [bit] NOT NULL DEFAULT 1,
	[SesionActiva] [bit] NOT NULL DEFAULT 0,
	[Caducidad] [datetime] NOT NULL DEFAULT GETUTCDATE(),
	[UltimoUso] [datetime] NOT NULL DEFAULT GETUTCDATE(),
	[FechaAlta] [datetime] NOT NULL DEFAULT GETUTCDATE(),
