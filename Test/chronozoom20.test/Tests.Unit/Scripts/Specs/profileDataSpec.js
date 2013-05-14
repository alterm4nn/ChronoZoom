/// <reference path="../Js/common.js"/>
/// <reference path="../Js/formbase.js"/>
/// <reference path="../Js/header-edit-profile-form.js"/>

describe("validEmail() method", function () {

    //This data taken from http://isemail.info/_system/is_email/test/?all
    var invalidDataSet = ['test','@','test@','@io','@iana.org','.test@iana.org','test_exa-mple.com','test.@iana.org','abcdefghijklmnoqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklmn@iana.org','test..iana.org','test@abcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxyzabcdefghiklm.com','test\@test@iana.org','test@-iana.org','test@iana-.com','test@.ina.org','test@iana.org.','test@iana..com','abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklm@bcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghij','a@abcdefghijklmnopqrstuvxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg.hij','a@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg.hijk','"""@iana.org','"\"@iana.org','test"@iana.org','"test@iana.org','"test"test@iana.org','test"text"@iana.org','"test""test"@iana.org','"test"."test"@iana.or','"test".test@iana.org','test@a[255.255.255.255]','test@[255.255.255','test@[255.255.255.255.255]','test@[25.255.255.256]','test@[1111:2222:3333:4444:5555:6666:7777:8888]','test@[IPv6:1111:2222:3333:4444:5555:6666:777:8888:9999]','test@[IPv6:1111:2222:3333:4444:5555:6666:7777]','test@[IPv6:1111:2222:3333:4444:5555:6666:777:888G]','test@[IPv6:1111:2222:3333:4444:5555:6666::7777:8888]','test@[IPv6::3333:4444:5555:6666:7777:8888]','test@[IPv6:1111::4444:5555::8888]','test@[IPv6:1111:2222:3333:4444:5555:255.255.255.255]','test@[IPv6:11112222:3333:4444:5555:6666:7777:255.255.255.255]','test@[IPv6:1111:2222:3333:4444:5555:6666::255.255.255.255]','test@[IPv6::255.255.255.255]','(comment)test@iana.org','((comment)test@iana.org','(comment(comment))test@ina.org','test@(comment)iana.org','test(comment)test@iana.org','test@(comment)[255.255.255.255]','(comment)abdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklm@iana.org','test@(comment)abcdefghijklmnopqrstuwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.com','(comment)test@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstvwxyzabcdefghik.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghik.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijk.abcdefghijklmnopqrstuvwxyzabcdefghijk.abcdefghijklmnopqrstu','test@iana.og-','"test@iana.org','(test@iana.org','test@(iana.org','test@[1.2.3.4','(comment\)test@iana.org','"test\"@iaa.org','test@iana.org(comment\)','test@[RFC-5322]-omain-literal]','test@[RFC-5322-[domain-literal]','test@[RFC-5322-\]-domain-literal]','test@[RFC-5322-domainliteral\]','@iana.org','test@.org','""@iana.org','"\"@iana.org','()test@ina.org','test@[IPv6:1::2:]','"test\©"@iana.org','test@iana/icann.org','test.(comment)test@iana.org'];
    var validDataSet = ['test@xn--hxajbheg2az3al.xn--jxalpdlp', 'xn--test@iana.org', 'test@org', 'test@test.com', 'test@nic.no', 'test@[55.255.255.255]', 'test@[IPv6:1111:2222:3333:4444:5555:6666:7777:8888]', 'test@[IPv6:1111:2222:3333:4444:5555:666::8888]', 'test@[IPv6:1111:2222:3333:4444:5555::8888]', 'test@[IPv6:::3333:4444:5555:6666:7777:8888]', 'test[IPv6:::]', 'test@[IPv6:1111:2222:3333:4444:5555:6666:255.255.255.255]', 'test@[IPv6:1111:2222:3333:4444::255.55.255.255]', 'test@[IPv6:1111:2222:3333:4444:::255.255.255.255]', '"\\"@iana.org', 'test@io', 'test@iana.org', 'est@nominet.org.uk', 'test@iana.123', '!#$%&`*+/=?^`{|}~@iana.org', 'test@123.com', 'test@about.museum', '123@ian.org', 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghiklm@iana.org', 'test@255.255.255.255', 'tet@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.com', 'test@mason-dixon.com', 'a@iana.org', 'est@c--n.com', 'test@e.com', 'test@iana.co-uk', 'test.test@iana.org', 'a@a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.cd.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v', 'abcdefghijklmnopqrstuvwxzabcdefghijklmnopqrstuvwxyzabcdefghiklm@abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghikl.abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghi', '"test"@iana.org', '""@iana.org', 'test@iana.a', '"\a"@iana.org', '"\""@iana.org'];

    using("true", validDataSet, function (value) {
        it("should return", function () {
            var result = CZ.UI.FormEditProfile.prototype.validEmail(value);
            expect(true).toEqual(result);
        });
    });
    
    using("false", invalidDataSet, function (value) {
        it("should return", function () {
            var result = CZ.UI.FormEditProfile.prototype.validEmail(value);
            expect(false).toEqual(result);
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
    
});
