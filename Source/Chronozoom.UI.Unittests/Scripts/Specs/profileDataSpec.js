/// <reference path="../../../Chronozoom.UI/ui/controls/formbase.js" />
/// <reference path="../../../Chronozoom.UI/ui/header-edit-profile-form.js" />

var formEditProfile = CZ.UI.FormEditProfile.prototype;

describe("validEmail() method", function () {

    //This data taken from http://isemail.info/_system/is_email/test/?all
    var invalidEmailsDataSet = ['test','@','test@','@io','@iana.org','.test@iana.org','test_exa-mple.com','test.@iana.org','test..iana.org','test\@test@iana.org','test@-iana.org','test@iana-.com','test@.ina.org','test@iana.org.','test@iana..com','a@abcdefghijklmnopqrstuvxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg.hij','a@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg.hijk','"""@iana.org','"\"@iana.org','test"@iana.org','"test@iana.org','"test"test@iana.org','test"text"@iana.org','"test""test"@iana.org','"test"."test"@iana.or','"test".test@iana.org','test@a[255.255.255.255]','test@[255.255.255','test@[255.255.255.255.255]','test@[25.255.255.256]','test@[1111:2222:3333:4444:5555:6666:7777:8888]','test@[IPv6:1111:2222:3333:4444:5555:6666:777:8888:9999]','test@[IPv6:1111:2222:3333:4444:5555:6666:7777]','test@[IPv6:1111:2222:3333:4444:5555:6666:777:888G]','test@[IPv6:1111:2222:3333:4444:5555:6666::7777:8888]','test@[IPv6::3333:4444:5555:6666:7777:8888]','test@[IPv6:1111::4444:5555::8888]','test@[IPv6:1111:2222:3333:4444:5555:255.255.255.255]','test@[IPv6:11112222:3333:4444:5555:6666:7777:255.255.255.255]','test@[IPv6:1111:2222:3333:4444:5555:6666::255.255.255.255]','test@[IPv6::255.255.255.255]','(comment)test@iana.org','((comment)test@iana.org','(comment(comment))test@ina.org','test@(comment)iana.org','test(comment)test@iana.org','test@(comment)[255.255.255.255]','(comment)abdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklm@iana.org','test@(comment)abcdefghijklmnopqrstuwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.com','(comment)test@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstvwxyzabcdefghik.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghik.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijk.abcdefghijklmnopqrstuvwxyzabcdefghijk.abcdefghijklmnopqrstu','test@iana.og-','"test@iana.org','(test@iana.org','test@(iana.org','test@[1.2.3.4','(comment\)test@iana.org','"test\"@iaa.org','test@iana.org(comment\)','test@[RFC-5322]-omain-literal]','test@[RFC-5322-[domain-literal]','test@[RFC-5322-\]-domain-literal]','test@[RFC-5322-domainliteral\]','@iana.org','test@.org','""@iana.org','"\"@iana.org','()test@ina.org','test@[IPv6:1::2:]','"test\©"@iana.org','test@iana/icann.org','test.(comment)test@iana.org'];
    var validEmailsDataSet = ['test.test.test@test.com', 'v-vvvvv@vvvvv.vvv', 'test@xn--hxajbheg2az3al.xn--jxalpdlp', 'xn--test@iana.org', 'test@test.com', 'te.st@nic.no', 'te+123@iana.org', 'est@nominet.org.uk', 'test@iana.123', 'test@123.com', 'test@about.museum', '123@ian.org', 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklm@iana.org', 'tet@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.com', 'test@mason-dixon.com', 'a@iana.org', 'est@c--n.com', 'test@e.com', 'test@iana.co-uk', 'test.test@iana.org', 'abcdefghijklmnopqrstuvwxzabcdefghijklmnopqrstuvwxyzabcdefghiklm@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghi', 'test@iana.a', ];

    using("true", validEmailsDataSet, function (value) {
        it("should return", function () {
            var result = formEditProfile.validEmail(value);
            expect(true).toEqual(result);
        });
    });
    
    using("false", invalidEmailsDataSet, function (value) {
        it("should return", function () {
            var result = formEditProfile.validEmail(value);
            expect(false).toEqual(result);
        });
    });

});

describe("validUsername() method", function () {

    var invalidUsernameDataSet = [' ', 'usr', 'veryveryveryveryveryveryveryverylongusername', 'user@name', 'user!@#$%^&*()name', '.username', 'valid@email.com','user name'];
    var validUsernameDataSet = ['user', 'usernameusernameuser', '1234567890', 'username123', 'UserName','user-name', 'user_name','user_','_user','----','____'];

    using("true", validUsernameDataSet, function (value) {
        it("should return", function () {
            var result = formEditProfile.validUsername(value);
            expect(true).toEqual(result);
        });
    });

    using("false", invalidUsernameDataSet, function (value) {
        it("should return", function () {
            var result = formEditProfile.validUsername(value);
            expect(false).toEqual(result);
        });
    });

});


function using(name, values, func) {
    for (var i = 0, count = values.length; i < count; i++) {
        if (Object.prototype.toString.call(values[i]) !== '[object Array]') {
            values[i] = [values[i]];
        }
        func.apply(this, values[i]);
        jasmine.currentEnv_.currentSpec.description += ' ' + name + ' if email equal ' + values[i].join(', ');
    }
}