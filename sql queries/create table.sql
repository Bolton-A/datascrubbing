CREATE TABLE Logins (
	Username VARCHAR(30) NOT NULL PRIMARY KEY,
	Password VARCHAR(255) NOT NULL,
	UserEmail VARCHAR(255) NOT NULL,
	TicketTime INT NOT NULL
);

INSERT INTO Logins (Username, Password, UserEmail, TicketTime)
VALUES ('LauraSmith', 'ls123', 'laura@gmail.com', 2);

SELECT * FROM Logins;
	
