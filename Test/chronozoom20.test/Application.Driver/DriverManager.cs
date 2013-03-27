namespace Application.Driver
{
    public class DriverManager
    {
        private static Environment _environment;

        public static Environment GetEnvironmentInstance()
        {
            return _environment ?? (_environment = new Environment());
        }
    }
}