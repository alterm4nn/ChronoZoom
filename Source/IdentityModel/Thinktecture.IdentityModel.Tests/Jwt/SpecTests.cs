
namespace Thinktecture.IdentityModel.Tests.Jwt
{
    // Json.Net and Spec have different formats - so this is pointless

    //[TestClass]
    //public class SpecTests
    //{
    //    [TestMethod]
    //    public void BasicEncoding()
    //    {
    //        var jwt = new JsonWebToken
    //        {
    //            Header = new JwtHeader
    //            {
    //                Type = JwtConstants.JWT,
    //                SignatureAlgorithm = JwtConstants.SignatureAlgorithms.HMACSHA256,
    //                SigningCredentials = new HmacSigningCredentials(SymmetricKeyGenerator.Create(32))
    //            },

    //            Issuer = "joe",
    //            ExpirationTime = 1300819380,

    //            Claims = new List<Claim>
    //            {
    //                new Claim("http://example.com/is_root", "true")
    //            }
    //        };

    //        var handler = new JsonWebTokenHandler();
    //        var token = handler.WriteToken(jwt);

    //        // token should not be empty
    //        Assert.IsTrue(!string.IsNullOrWhiteSpace(token));

    //        // token with signature needs to be 3 parts
    //        var parts = token.Split('.');
    //        Assert.IsTrue(parts.Length == 3, "JWT should have excactly 3 parts");

    //        var expectedHeader = "eyJ0eXAiOiJKV1QiLA0KICJhbGciOiJIUzI1NiJ9";
    //        var expectedClaims = "eyJpc3MiOiJqb2UiLA0KICJleHAiOjEzMDA4MTkzODAsDQogImh0dHA6Ly9leGFtcGxlLmNvbS9pc19yb290Ijp0cnVlfQ";

    //        Assert.AreEqual<string>(expectedHeader, parts[0], "Header does not match spec");
    //        Assert.AreEqual<string>(expectedClaims, parts[1], "Claims do not match spec");
    //    }
    //}
}
