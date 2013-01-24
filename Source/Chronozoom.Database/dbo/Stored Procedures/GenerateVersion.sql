



CREATE PROCEDURE [dbo].[GenerateVersion]
--@UserID uniqueidentifier
AS

DECLARE @UserID uniqueidentifier
DECLARE @UpdateStatements as table(UpdateStatementID int primary key identity(1,1), [UpdateStatement] nvarchar(512), InsertStatement nvarchar(512))
DECLARE @VersionNumber int
DECLARE @CreatedDate DateTime
DECLARE @index int
DECLARE @count int
DECLARE @res int
DECLARE @doCommit int;

SET @doCommit = 0;

BEGIN TRANSACTION
BEGIN TRY
	EXEC @res = sp_getapplock                 
					@Resource = 'GenerateVersionNumberLock',
					@LockMode = 'Exclusive'
	if @res < 0
	BEGIN
		RAISERROR ( 'Failed to acquire lock',16, 1)
	END

	--check if there are any versions
	IF (SELECT COUNT(*) FROM CZVersion) = 0
	BEGIN
		SELECT	@VersionNumber = 1
	END
	ELSE 
	BEGIN
		SELECT	@VersionNumber = MAX(VersionNumber) + 1
				,@CreatedDate = CreatedDate
		FROM CZVersion
		GROUP BY CreatedDate
	END

	INSERT INTO CZVersion(VersionNumber, CreatedDate, UserID)
	VALUES(@VersionNumber, GETDATE(), @UserID);
	
	INSERT INTO @UpdateStatements
	select  distinct(
		'UPDATE [' + t.name + ']
		SET CurrVersion = ' + CAST(@VersionNumber as nvarchar(32)) + 
		CASE WHEN @CreatedDate IS NULL 
			THEN '' 
		ELSE '
		WHERE (CurrVersion IS NULL
		OR ModifiedOn > CAST(''' + CAST(@CreatedDate as nvarchar(64)) + ''' as DateTime))' END
		),
		'INSERT INTO Version_' + t.name + '
		SELECT *, NEWID() FROM [' + t.name + ']
		WHERE CurrVersion = ' + CAST(@VersionNumber as nvarchar(32))
	from sys.tables as t, sys.columns as c
	where t.object_id = c.object_id
	and t.object_id IN( SELECT object_id FROM sys.columns ic where ic.name like 'ModifiedOn')
	and c.name like 'CurrVersion'
	and t.name not like 'Version_%'
	and t.name not like 'Prod_%'
	and t.name not like 'Staging_%'
		
	SET @index = 1;

	SELECT @count = COUNT(*)
	FROM @UpdateStatements

	WHILE(@index <= @count) 
	BEGIN
		DECLARE @UpdateStatement nvarchar(512)
		DECLARE @InsertStatement nvarchar(512)
		
		SELECT	@UpdateStatement = UpdateStatement,
				@InsertStatement = InsertStatement
		FROM @UpdateStatements
		WHERE UpdateStatementID = @index

		EXEC (@UpdateStatement)
		EXEC (@InsertStatement)
		
		SET @index = @index + 1
	END

	EXEC @res = sp_releaseapplock                 
                @Resource = 'GenerateVersionNumberLock'
	COMMIT TRANSACTION
	SET @doCommit = 1	
END TRY 
BEGIN CATCH
DECLARE @ErrorMessage NVARCHAR(4000);
	ROLLBACK TRANSACTION

	EXEC @res = sp_releaseapplock                 
                @Resource = 'GenerateVersionNumberLock'

    DECLARE @ErrorSeverity INT;
    DECLARE @ErrorState INT;

    SELECT @ErrorMessage = ERROR_MESSAGE(),
           @ErrorSeverity = ERROR_SEVERITY(),
           @ErrorState = ERROR_STATE();

    RAISERROR (@ErrorMessage,
               @ErrorSeverity,
               @ErrorState
               );
END CATCH

return @doCommit;




