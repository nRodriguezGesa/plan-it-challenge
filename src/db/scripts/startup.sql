IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'clients')
BEGIN
    CREATE DATABASE clients;
    PRINT 'Clients Database created successfully';
END
ELSE
BEGIN
    PRINT 'Clients database already exists';
END
GO

USE clients;
GO

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='client' AND xtype='U')
BEGIN
    CREATE TABLE client (
        id INT IDENTITY(1,1) PRIMARY KEY,
        client_id VARCHAR(10) NOT NULL UNIQUE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(200) NULL,
        age INT NULL,
        created_at DATETIME2 DEFAULT GETDATE()
    );
    
    CREATE INDEX IX_client_email ON client(email);
    CREATE INDEX IX_client_client_id ON client(client_id);;    
    PRINT 'Client table created successfully';
END
ELSE
BEGIN
    PRINT 'Client table already exists';
END
GO

SELECT 'Startup completed' AS status, COUNT(*) AS total_tables 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_CATALOG = 'clients';
GO