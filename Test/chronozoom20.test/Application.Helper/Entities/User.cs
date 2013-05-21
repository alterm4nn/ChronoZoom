namespace Application.Helper.Entities
{
    public class User
    {
        public string Login { get; set; }
        public string Password { get; set; }
        public UserType Type { get; set; }

        public override string ToString()
        {
            return string.Format("Login: {0}, UserType: {1}", Login, Type);
        }
    }

    public enum UserType
    {
        Google,
        Yahoo,
        Microsoft
    }
}