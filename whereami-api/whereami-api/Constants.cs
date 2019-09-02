using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace whereami_api
{
    public static class Constants
    {
        public static readonly string TokenInfoUrl = "https://www.googleapis.com/oauth2/v3/tokeninfo";
        public static readonly string UserEmailHeader = "x-user-email";
        public static readonly string IdTokenHeader = "x-id-token";
    }
}