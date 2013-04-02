/*
 * Copyright (c) Dominick Baier & Brock Allen.  All rights reserved.
 * see license.txt
 */

namespace Thinktecture.IdentityModel.Constants
{
    public static class WSTrust13Constants
    {
        public const string NamespaceURI = "http://docs.oasis-open.org/ws-sx/ws-trust/200512";
        public const string Prefix = "trust";
        public const string Schema = "<?xml version='1.0' encoding='utf-8'?>\r\n<xs:schema xmlns:xs='http://www.w3.org/2001/XMLSchema'\r\n           xmlns:trust='http://docs.oasis-open.org/ws-sx/ws-trust/200512'\r\n           targetNamespace='http://docs.oasis-open.org/ws-sx/ws-trust/200512'\r\n           elementFormDefault='qualified' >\r\n\r\n<xs:element name='RequestSecurityToken' type='trust:RequestSecurityTokenType' />\r\n  <xs:complexType name='RequestSecurityTokenType' >\r\n    <xs:choice minOccurs='0' maxOccurs='unbounded' >\r\n        <xs:any namespace='##any' processContents='lax' minOccurs='0' maxOccurs='unbounded' />\r\n    </xs:choice>\r\n    <xs:attribute name='Context' type='xs:anyURI' use='optional' />\r\n    <xs:anyAttribute namespace='##other' processContents='lax' />\r\n  </xs:complexType>\r\n\r\n<xs:element name='RequestSecurityTokenResponse' type='trust:RequestSecurityTokenResponseType' />\r\n  <xs:complexType name='RequestSecurityTokenResponseType' >\r\n    <xs:choice minOccurs='0' maxOccurs='unbounded' >\r\n        <xs:any namespace='##any' processContents='lax' minOccurs='0' maxOccurs='unbounded' />\r\n    </xs:choice>\r\n    <xs:attribute name='Context' type='xs:anyURI' use='optional' />\r\n    <xs:anyAttribute namespace='##other' processContents='lax' />\r\n  </xs:complexType>\r\n\r\n  <xs:element name='RequestSecurityTokenResponseCollection' type='trust:RequestSecurityTokenResponseCollectionType' />\r\n  <xs:complexType name='RequestSecurityTokenResponseCollectionType' >\r\n    <xs:sequence>\r\n      <xs:element ref='trust:RequestSecurityTokenResponse' minOccurs='1' maxOccurs='unbounded' />\r\n    </xs:sequence>\r\n    <xs:anyAttribute namespace='##other' processContents='lax' />\r\n  </xs:complexType>\r\n\r\n        </xs:schema>";
        public const string SchemaLocation = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/ws-trust-1.3.xsd";

        public static class Actions
        {
            public const string Cancel = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Cancel";
            public const string CancelFinalResponse = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RSTR/CancelFinal";
            public const string CancelResponse = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RSTR/Cancel";
            public const string Issue = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue";
            public const string IssueFinalResponse = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RSTRC/IssueFinal";
            public const string IssueResponse = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RSTR/Issue";
            public const string Renew = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Renew";
            public const string RenewFinalResponse = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RSTR/RenewFinal";
            public const string RenewResponse = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RSTR/Renew";
            public const string RequestSecurityContextToken = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/SCT";
            public const string RequestSecurityContextTokenCancel = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/SCT-Cancel";
            public const string RequestSecurityContextTokenResponse = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RSTR/SCT";
            public const string RequestSecurityContextTokenResponseCancel = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RSTR/SCT-Cancel";
            public const string Validate = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Validate";
            public const string ValidateFinalResponse = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RSTR/ValidateFinal";
            public const string ValidateResponse = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/RSTR/Validate";
        }

        public static class AttributeNames
        {
            public const string Allow = "Allow";
            public const string Context = "Context";
            public const string Dialect = "Dialect";
            public const string EncodingType = "EncodingType";
            public const string OK = "OK";
            public const string Type = "Type";
            public const string ValueType = "ValueType";
        }

        public static class ComputedKeyAlgorithms
        {
            public const string PSHA1 = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/CK/PSHA1";
        }

        public static class ElementNames
        {
            public const string AllowPostdating = "AllowPostdating";
            public const string AuthenticationType = "AuthenticationType";
            public const string BinaryExchange = "BinaryExchange";
            public const string BinarySecret = "BinarySecret";
            public const string CancelTarget = "CancelTarget";
            public const string CanonicalizationAlgorithm = "CanonicalizationAlgorithm";
            public const string Claims = "Claims";
            public const string Code = "Code";
            public const string ComputedKey = "ComputedKey";
            public const string ComputedKeyAlgorithm = "ComputedKeyAlgorithm";
            public const string Delegatable = "Delegatable";
            public const string DelegateTo = "DelegateTo";
            public const string Encryption = "Encryption";
            public const string EncryptionAlgorithm = "EncryptionAlgorithm";
            public const string EncryptWith = "EncryptWith";
            public const string Entropy = "Entropy";
            public const string Forwardable = "Forwardable";
            public const string Issuer = "Issuer";
            public const string KeySize = "KeySize";
            public const string KeyType = "KeyType";
            public const string KeyWrapAlgorithm = "KeyWrapAlgorithm";
            public const string Lifetime = "Lifetime";
            public const string OnBehalfOf = "OnBehalfOf";
            public const string Participant = "Participant";
            public const string Participants = "Participants";
            public const string Primary = "Primary";
            public const string ProofEncryption = "ProofEncryption";
            public const string Reason = "Reason";
            public const string Renewing = "Renewing";
            public const string RenewTarget = "RenewTarget";
            public const string RequestedAttachedReference = "RequestedAttachedReference";
            public const string RequestedProofToken = "RequestedProofToken";
            public const string RequestedSecurityToken = "RequestedSecurityToken";
            public const string RequestedTokenCancelled = "RequestedTokenCancelled";
            public const string RequestedUnattachedReference = "RequestedUnattachedReference";
            public const string RequestKeySize = "RequestKeySize";
            public const string RequestSecurityToken = "RequestSecurityToken";
            public const string RequestSecurityTokenResponse = "RequestSecurityTokenResponse";
            public const string RequestSecurityTokenResponseCollection = "RequestSecurityTokenResponseCollection";
            public const string RequestType = "RequestType";
            public const string SecondaryParameters = "SecondaryParameters";
            public const string SecurityContextToken = "SecurityContextToken";
            public const string SignatureAlgorithm = "SignatureAlgorithm";
            public const string SignWith = "SignWith";
            public const string Status = "Status";
            public const string TokenType = "TokenType";
            public const string UseKey = "UseKey";
            public const string ValidateTarget = "ValidateTarget";
        }

        public static class FaultCodeValues
        {
            // Fields
            public const string AuthenticationBadElements = "AuthenticationBadElements";
            public const string BadRequest = "BadRequest";
            public const string ExpiredData = "ExpiredData";
            public const string FailedAuthentication = "FailedAuthentication";
            public const string InvalidRequest = "InvalidRequest";
            public const string InvalidScope = "InvalidScope";
            public const string InvalidSecurityToken = "InvalidSecurityToken";
            public const string InvalidTimeRange = "InvalidTimeRange";
            public const string RenewNeeded = "RenewNeeded";
            public const string RequestFailed = "RequestFailed";
            public const string UnableToRenew = "UnableToRenew";
        }

        public static class KeyTypes
        {
            public const string Asymmetric = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/PublicKey";
            public const string Bearer = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/Bearer";
            public const string Symmetric = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/SymmetricKey";
        }

        public static class RequestTypes
        {
            public const string Cancel = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/Cancel";
            public const string Issue = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/Issue";
            public const string Renew = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/Renew";
            public const string Validate = "http://docs.oasis-open.org/ws-sx/ws-trust/200512/Validate";
        }
    }
}
