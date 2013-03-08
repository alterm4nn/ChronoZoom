CREATE FUNCTION [dbo].[GetForkNode]
@start_time int, @end_time int RETURNS INT
AS
BEGIN
	DECLATE @node int
	SET @node = ((@start_time - 1) ^ @end_time) / 2;  -- ">>1" (right shift by 1 bit)
	SET @node = @node | (@node / 2);        -- ">>1" (right shift by 1 bit)
	SET @node = @node | (@node / 4);        -- ">>2" (right shift by 2 bits)
	SET @node = @node | (@node / 16);       -- ">>4" (right shift by 4 bits)
	SET @node = @node | (@node / 256);      -- ">>8" (right shift by 8 bits)
	SET @node = @node | (@node / 65536);    -- ">>16" (right shift by 16 bits)
	SET @node = @end_time & ~@node;
	RETURN @node
END
