/*
 * Copyright (c) Dominick Baier.  All rights reserved.
 * see license.txt
 */

namespace Thinktecture.IdentityModel.Tokens.Http
{
    public enum ClientCertificateMode
    {
        ChainValidation,
        PeerValidation,
        ChainValidationWithIssuerSubjectName,
        ChainValidationWithIssuerThumbprint,
        IssuerThumbprint
    }
}
