using System.Runtime.Serialization;

namespace Application.Helper.Entities
{
    [DataContract]
    public class User
    {
        [DataMember(Name = "login")]
        public string Login { get; set; }
        [DataMember(Name = "password")]
        public string Password { get; set; }
        [DataMember(Name = "type")]
        public string Type { get; set; }

        public override string ToString()
        {
            return string.Format("Login: {0}, UserType: {1}", Login, Type);
        }
    }
}